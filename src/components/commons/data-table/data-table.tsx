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
import { type CSSProperties, useMemo, useState } from 'react'
import DataTableToolbar from '@/components/commons/data-table/data-table-toolbar'
import DataTableFooter from '@/components/commons/data-table/data-table-footer'
import { DataTableColumnHeader } from '@/components/commons/data-table/data-table-column-header'
import { DataTableColumnSelection } from '@/components/commons/data-table/data-table-column-selection'
import DataTableSelectionActions from '@/components/commons/data-table/data-table-selection-actions'
import { FILTERS, FilterType } from '@/components/commons/data-table/data-table-filters'

type CustomColumnDefProps<TData> = {
  accessorKey?: keyof TData;
  width?: string | number;
  minWidth?: string | number;
  label?: string;
}
type OnClickActionBase<TData, TReturn = void> = (rows: TData[], cleanRowSelection: () => void) => TReturn

type FilterableOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface FilterableColumn<TData> {
  columnKey: keyof TData;
  label?: string;
  type: `${FilterType}`;
  options?: FilterableOption[]
}

export type SelectionActionProps<TData> = {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: OnClickActionBase<TData>;
}

export interface DataTableActions<TData> {
  onRemoveRows?: OnClickActionBase<TData>
  customActions?: Array<SelectionActionProps<TData> | { component: OnClickActionBase<TData, React.JSX.Element> }>
}

export type CustomColumnDef<TData> = ColumnDef<TData> & CustomColumnDefProps<TData>

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue> & CustomColumnDefProps<TData>>;
  data: TData[];
  disableInputSearch?: boolean;
  disableRowSelection?: boolean;
  actions?: DataTableActions<TData>
  filterableColumns?: Array<FilterableColumn<TData>>
}

export function DataTable<TData, TValue> ({
  columns,
  data,
  disableRowSelection = false,
  disableInputSearch = false,
  actions = {},
  filterableColumns
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const extendedColumn = useMemo(() => {
    return columns.map(column => {
      const filter = filterableColumns?.find((field) => field.columnKey === column.accessorKey)
      if (filter) { column.filterFn = FILTERS[filter.type] }

      const assesorFn = (originalRow: TData) => originalRow[column.accessorKey as keyof TData]?.toString()

      return {
        accessorFn: column.accessorKey ? assesorFn : undefined,
        ...column
      }
    })
  }, [columns, filterableColumns])

  const memorizedColumns = useMemo(() => {
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
  const minWidthExists = columns.some((column) => column.width)

  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  return (
    <>
      <DataTableToolbar table={table} hideSearch={disableInputSearch} />

      <div className="rounded-md border relative">
        <Table className={!widthExists ? 'w-auto' : 'w-full'}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef as CustomColumnDef<TData>
                  const columnStyle: CSSProperties = {
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
                    const columnStyle: CSSProperties = {
                      width: widthExists ? (column.width === 'auto' ? 0 : column.width) : '100%',
                      minWidth: minWidthExists ? column.minWidth : undefined
                    }
                    return (
                      <TableCell key={cell.id} style={columnStyle}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )})}
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
