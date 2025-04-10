import * as React from 'react'
import {
  type ColumnDef,
  type Table as TableType,
  type VisibilityState,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { DataTableLeftToolbar, DataTableRightToolbar, DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import DataTableFooter from '@/components/data-table/data-table-footer'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableColumnSelection, DataTableSelectionActions } from '@/components/data-table/data-table-column-selection'
import { FILTERS } from '@/components/data-table/data-table-filters'
import type { CustomColumnDef, CustomColumnDefProps, DataTableActions, DataTableTabsConfig, FilterableColumn } from '@/components/data-table/data-table-types'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DataTable<TData, TValue> ({
  columns,
  data,
  mock,
  disableRowSelection = false,
  actions = {},
  filterableColumns,
  disableCopyJSON = false,
  isLoading = false,
  tabs: tabsConfig
}: {
  columns: Array<ColumnDef<TData, TValue> & CustomColumnDefProps<TData>>;
  data: TData[] | undefined;
  mock?: TData[];
  disableRowSelection?: boolean;
  actions?: DataTableActions<TData>;
  filterableColumns?: Array<FilterableColumn<TData>>;
  disableCopyJSON?: boolean;
  isLoading?: boolean;
  tabs?: DataTableTabsConfig<TData>;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState<string>(tabsConfig?.defaultTab || tabsConfig?.tabs?.[0]?.value || 'all')

  React.useEffect(() => {
    if (tabsConfig) {
      const activeTabConfig = tabsConfig.tabs.find(tab => tab.value === activeTab)
      if (activeTabConfig?.columnVisibility) {
        setColumnVisibility(activeTabConfig.columnVisibility)
      } else {
        setColumnVisibility({})
      }
    }
  }, [activeTab, tabsConfig])

  const extendedColumn = React.useMemo(() => {
    return columns.map(column => {
      const filter = filterableColumns?.find((field) => field.columnKey === column.accessorKey)
      if (filter) {
        column.filterFn = FILTERS[filter.type]
      } else if (!column.filterFn) {
        column.filterFn = FILTERS.partialMatch
      }
      const accessorFn = (originalRow: TData) =>
        originalRow[column.accessorKey as keyof TData]?.toString()
      return {
        accessorFn: column.accessorKey ? accessorFn : undefined,
        ...column
      }
    })
  }, [columns, filterableColumns])

  const memorizedColumns = React.useMemo(() => {
    if (!disableRowSelection) {
      return [
        DataTableColumnSelection<TData>(),
        ...extendedColumn
      ]
    }
    return extendedColumn
  }, [extendedColumn, disableRowSelection])

  const filteredData = React.useMemo(() => {
    if (!tabsConfig || !data) return data

    const activeTabConfig = tabsConfig.tabs.find(tab => tab.value === activeTab)
    if (!activeTabConfig || !activeTabConfig.filter) return data

    return data.filter(activeTabConfig.filter)
  }, [data, tabsConfig, activeTab])

  const table = useReactTable({
    data: filteredData ?? mock ?? [],
    columns: memorizedColumns,
    globalFilterFn: FILTERS.globalSearch,
    defaultColumn: { filterFn: FILTERS.partialMatch },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const widthExists = columns.some((column) => column.width)
  const minWidthExists = columns.some((column) => column.minWidth)

  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  return (
    <>
      <DataTableToolbar>
        <DataTableLeftToolbar table={table} />
        <DataTableRightToolbar
          table={table}
          onExport={actions?.onExport}
          disableCopyJSON={disableCopyJSON}
        />
      </DataTableToolbar>

      {tabsConfig && (
        <Tabs
          defaultValue={tabsConfig.defaultTab || tabsConfig.tabs[0].value}
          className={tabsConfig.className}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className='w-full pb-0 rounded-none bg-transparent justify-start [&>button]:grow-0 [&>button]:px-3 [&>button]:border-0 [&>button]:rounded-none [&>button]:dark:data-[state=active]:bg-transparent [&>button]:dark:data-[state=active]:border-b-2 [&>button]:dark:data-[state=active]:border-primary [&>button]:dark:data-[state=active]:text-primary [&>button]:hover:text-primary/90'>
            {tabsConfig.tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="rounded-md border relative [&>div]:overflow-clip [&>div]:rounded-t-md">
        <ScrollArea type='always'>
          <Table className={!widthExists ? 'w-auto' : 'w-full'}>
            <DataTableHeader
              table={table}
              widthExists={widthExists}
              minWidthExists={minWidthExists}
              filterableColumns={filterableColumns}
            />
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <DataTableRow
                  table={table}
                  widthExists={widthExists}
                  minWidthExists={minWidthExists}
                  isLoading={isLoading}
                />
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />

          <DataTableSelectionActions
            table={table}
            selectedRows={selectedRows}
            actions={actions}
          />
        </ScrollArea>

        <DataTableFooter table={table} />

      </div>
    </>
  )
}

function DataTableHeader<TData> ({
  table,
  widthExists,
  minWidthExists,
  filterableColumns
}: {
  table: TableType<TData>;
  widthExists: boolean;
  minWidthExists: boolean;
  filterableColumns?: Array<FilterableColumn<TData>>;
}) {
  return (
    <TableHeader className='bg-background/30 backdrop-blur-lg border-0 [&_tr]:border-0 outline outline-border sticky top-0 z-10'>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const column = header.column.columnDef as CustomColumnDef<TData>
            const columnStyle: React.CSSProperties = {
              width: widthExists ? (column.width === 'auto' ? '0%' : column.width) : '100%',
              minWidth: minWidthExists ? column.minWidth : undefined
            }
            const filterableColumn = filterableColumns?.find((field) => field.columnKey === header.column.id)
            return (
              <TableHead
                key={header.id}
                className='px-0'
                style={columnStyle}
              >
                <DataTableColumnHeader
                  className='mr-1'
                  header={header}
                  filterableColumn={filterableColumn}
                />
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

function DataTableRow<TData> ({
  table,
  widthExists,
  minWidthExists,
  isLoading
}: {
  table: TableType<TData>;
  widthExists: boolean;
  minWidthExists: boolean;
  isLoading: boolean;
}) {
  const totalColumns = table.getAllColumns().length
  return (
    table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
      >
        {row.getVisibleCells().map((cell, i) => {
          const column = cell.column.columnDef as CustomColumnDef<TData>
          const columnStyle: React.CSSProperties = {
            width: widthExists ? (column.width === 'auto' ? 0 : column.width) : '100%',
            minWidth: minWidthExists ? column.minWidth : undefined,
            textAlign: column.align
          }
          const content = flexRender(cell.column.columnDef.cell, cell.getContext())
          return (
            <TableCell
              key={cell.id}
              className='px-3'
              style={columnStyle}
            >
              {isLoading && i !== 0 && i !== totalColumns - 1 ? (
                <Skeleton className="w-fit h-3 align-middle my-2.5 rounded-xl inline-flex">
                  <span className='h-0 opacity-0 pointer-events-none select-none'>{content}</span>
                </Skeleton>
              ) : content}
            </TableCell>
          )
        })}
      </TableRow>
    ))
  )
}
