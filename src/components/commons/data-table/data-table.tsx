import * as React from 'react'
import {
  type ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { DataTableLeftToolbar, DataTableRightToolbar, DataTableToolbar } from '@/components/commons/data-table/data-table-toolbar'
import DataTableFooter from '@/components/commons/data-table/data-table-footer'
import { DataTableColumnHeader } from '@/components/commons/data-table/data-table-column-header'
import { DataTableColumnSelection } from '@/components/commons/data-table/data-table-column-selection'
import DataTableSelectionActions from '@/components/commons/data-table/data-table-selection-actions'
import { FILTERS } from '@/components/commons/data-table/data-table-filters'
import type { CustomColumnDef, CustomColumnDefProps, DataTableActions, FilterableColumn } from '@/components/commons/data-table/data-table-types'

export function DataTable<TData, TValue> ({
  columns,
  data,
  disableRowSelection = false,
  actions = {},
  filterableColumns
}: {
  columns: Array<ColumnDef<TData, TValue> & CustomColumnDefProps<TData>>;
  data: TData[];
  disableRowSelection?: boolean;
  actions?: DataTableActions<TData>
  filterableColumns?: Array<FilterableColumn<TData>>
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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

  const table = useReactTable({
    data,
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
        <DataTableRightToolbar table={table} />
      </DataTableToolbar>

      <div className="rounded-md border relative">
        <Table className={!widthExists ? 'w-auto' : 'w-full'}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef as CustomColumnDef<TData>
                  const columnStyle: React.CSSProperties = {
                    width: widthExists ? (column.width === 'auto' ? 0 : column.width) : '100%',
                    minWidth: minWidthExists ? column.minWidth : undefined
                  }
                  const filterableColumn = filterableColumns?.find((field) => field.columnKey === header.column.id)
                  return (
                    <TableHead key={header.id} style={columnStyle}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column.columnDef as CustomColumnDef<TData>
                    const columnStyle: React.CSSProperties = {
                      width: widthExists ? (column.width === 'auto' ? 0 : column.width) : '100%',
                      minWidth: minWidthExists ? column.minWidth : undefined
                    }
                    return (
                      <TableCell key={cell.id} style={columnStyle}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTableSelectionActions
          table={table}
          selectedRows={selectedRows}
          actions={actions}
        />

        <DataTableFooter table={table} />
      </div>
    </>
  )
}
