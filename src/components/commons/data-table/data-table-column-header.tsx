import { flexRender, Header } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronDownIcon, ChevronsUpDown, EyeOff, RotateCcwIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  header:  Header<TData, unknown>
}

export function DataTableColumnHeader<TData> ({
  header,
  className
}: DataTableColumnHeaderProps<TData>) {
  const column = header.column
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()

  if (!canSort && !canHide) {
    return (
      <div className={cn('flex items-center', className)}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={!column.getIsSorted() ? 'ghost' : 'secondary'}
            size="sm"
            className={cn('-ml-3 h-8 data-[state=open]:bg-accent text-xs', column.getIsSorted() && 'font-bold')}
          >
            {header.isPlaceholder
              ? null
              : flexRender(
                column.columnDef.header,
                header.getContext()
              )}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp />
            ) : (
              canSort ? <ChevronsUpDown /> : <ChevronDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
              {column.getIsSorted() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => column.clearSorting()}>
                    <RotateCcwIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                    Reset
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
          {canHide && canSort && <DropdownMenuSeparator />}
          {canHide && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
