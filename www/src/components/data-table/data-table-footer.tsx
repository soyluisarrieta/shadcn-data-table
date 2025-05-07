import type { Table } from '@tanstack/react-table'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from 'lucide-react'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface DataTableFooterProps<TData> {
  table: Table<TData>
}

export default function DataTableFooter<TData> ({
  table
}: DataTableFooterProps<TData>) {
  const startRowNumber = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
  const endRowNumber = Math.min(
    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
    table.getFilteredRowModel().rows.length
  )

  if (table.getFilteredRowModel().rows.length < 10) return null

  return (
    <div className='flex flex-wrap justify-between items-center border-t gap-y-3 gap-x-2 sm:gap-x-6 md:gap-x-12 pt-4'>
      <div className="whitespace-nowrap text-sm text-muted-foreground">
        {TC.PAGINATION.SHOWING_ROWS
          .replace('{start}', startRowNumber.toString())
          .replace('{end}', endRowNumber.toString())
          .replace('{total}', table.getFilteredRowModel().rows.length.toString())}
      </div>

      <div className="flex-1 flex items-center justify-end space-x-1">
        <Button
          variant="outline"
          className="hidden md:flex size-7 p-0"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{TC.PAGINATION.GO_TO_FIRST_PAGE}</span>
          <ChevronFirstIcon />
        </Button>
        <Button
          variant="outline"
          className="size-7 p-0"
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{TC.PAGINATION.GO_TO_PREVIOUS_PAGE}</span>
          <ChevronLeftIcon />
        </Button>
        <div className="flex px-2 items-center justify-center text-sm text-muted-foreground whitespace-nowrap">
          {TC.PAGINATION.PAGE_X_OF_Y
            .replace('{current}', String(table.getState().pagination.pageIndex + 1).padStart(2, '0'))
            .replace('{total}', String(table.getPageCount()).padStart(2, '0'))}
        </div>
        <Button
          variant="outline"
          className="size-7 p-0"
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{TC.PAGINATION.GO_TO_NEXT_PAGE}</span>
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          className="hidden md:flex size-7 p-0"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{TC.PAGINATION.GO_TO_LAST_PAGE}</span>
          <ChevronLastIcon />
        </Button>
      </div>

      <div className="whitespace-nowrap flex items-center justify-end space-x-2">
        <p className="text-sm text-muted-foreground">
          {TC.PAGINATION.ROWS_PER_PAGE}
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className='h-7 data-[size=sm]:h-7 px-2' size='sm'>
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
