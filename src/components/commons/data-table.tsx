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
import { type CSSProperties, useState } from 'react'
import DataTableToolbar from '@/components/commons/data-table-toolbar'
import DataTableFooter from '@/components/commons/data-table-footer'

type CustomColumnDefProps = {
  width?: string | number
  minWidth?: string | number
}

export type CustomColumnDef<TData> = ColumnDef<TData> & CustomColumnDefProps

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue> & CustomColumnDefProps>
  data: TData[]
}

export function DataTable<TData, TValue> ({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
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

  return (
    <>
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
        <DataTableFooter table={table} />
      </div>
    </>
  )
}
