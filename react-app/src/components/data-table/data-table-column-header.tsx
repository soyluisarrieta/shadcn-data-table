import type { CustomColumnDef } from '@/components/data-table/data-table-types'
import { type Header, flexRender } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
  MinusIcon
} from 'lucide-react'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function DataTableColumnHeader<TData> ({
  header,
  className
}: React.HTMLAttributes<HTMLDivElement> & {
  header:  Header<TData, unknown>
}) {

  const column = header.column
  const columnDef = column.columnDef as CustomColumnDef<TData>
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()

  if (!canSort && !canHide) {
    return (
      <div className={cn('flex items-center text-muted-foreground hover:text-secondary-foreground', className)}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    )
  }

  return (
    <div
      className={cn('flex items-center space-x-2', className)}
      style={{ justifyContent: columnDef.align }}
    >
      <DropdownMenu>
        <Button
          variant='link'
          size="sm"
          className={cn('h-8 hover:no-underline font-medium text-xs text-secondary-foreground/70 hover:text-secondary-foreground data-[state=open]:text-secondary-foreground focus-visible:text-secondary-foreground focus-visible:ring-0', column.getIsSorted() && 'font-bold bg-muted/70')}
          asChild
        >
          <DropdownMenuTrigger>
            {flexRender(column.columnDef.header, header.getContext())}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='size-3.5 mt-px' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='size-3.5 mt-px' />
            ) : (
              <ChevronsUpDownIcon className='size-3 mt-px' />
            )}
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                {TC.FILTERS.SORT_ASC}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                {TC.FILTERS.SORT_DESC}
              </DropdownMenuItem>
              {column.getIsSorted() && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <MinusIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {TC.COLUMNS.RESET_BUTTON}
                </DropdownMenuItem>
              )}
            </>
          )}
          {canHide && canSort && <DropdownMenuSeparator />}
          {canHide && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
              {TC.FILTERS.HIDE_COLUMN}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
