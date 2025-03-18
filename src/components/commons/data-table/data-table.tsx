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

type CustomColumnDefProps = {
  width?: string | number;
  minWidth?: string | number;
};

type OnClickActionBase<TData, TReturn = void> = (rows: TData[], cleanRowSelection: () => void) => TReturn

export type SelectionActionProps<TData> = {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: OnClickActionBase<TData>;
}

export interface DataTableActions<TData> {
  onRemoveRows?: OnClickActionBase<TData>
  customActions?: Array<SelectionActionProps<TData> | { component: OnClickActionBase<TData, React.JSX.Element> }>
}

export type CustomColumnDef<TData> = ColumnDef<TData> & CustomColumnDefProps;

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue> & CustomColumnDefProps>;
  data: TData[];
  disableRowSelection?: boolean;
  actions?: DataTableActions<TData>
}

export function DataTable<TData, TValue> ({
  columns,
  data,
  disableRowSelection = false,
  actions = {}
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const memorizedColumns = useMemo(() => {
    if (!disableRowSelection) {
      return [
        DataTableColumnSelection<TData>(),
        ...columns
      ]
    }
    return columns
  }, [columns, disableRowSelection])

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
      <DataTableToolbar table={table} />

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
                  return (
                    <TableHead key={header.id} style={columnStyle}>
                      <DataTableColumnHeader className='mr-1' header={header} />
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
      </div>

      <DataTableFooter table={table} />
    </>
  )
}
