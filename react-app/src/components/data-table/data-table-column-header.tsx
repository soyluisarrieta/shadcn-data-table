import type { FilterableColumn, CustomColumnDef } from '@/components/data-table/data-table-types'
import { type Header, flexRender } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  EyeOff,
  RotateCcwIcon
} from 'lucide-react'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { FilterType } from '@/components/data-table/data-table-filters'

export function DataTableColumnHeader<TData> ({
  header,
  className,
  filterableColumn
}: React.HTMLAttributes<HTMLDivElement> & {
  header:  Header<TData, unknown>
  filterableColumn?: FilterableColumn<TData>
}) {
  const isSingleSelection = filterableColumn?.type === FilterType.SingleSelection

  const column = header.column
  const columnDef = column.columnDef as CustomColumnDef<TData>
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()

  if (!canSort && !canHide) {
    return (
      <div className={cn('flex items-center', className)}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    )
  }

  const unknownValue = column?.getFilterValue()
  const selectedValues = new Set(Array.isArray(unknownValue) ? unknownValue : [])
  const isFilteredColumn = column.getIsSorted() || selectedValues.size

  return (
    <div
      className={cn('flex items-center space-x-2', className)}
      style={{ justifyContent: columnDef.align }}
    >
      <DropdownMenu>
        <Button
          variant={isFilteredColumn ? 'secondary' : 'ghost'}
          size="sm"
          className={cn('h-8 data-[state=open]:bg-accent text-xs', isFilteredColumn && 'font-bold')}
          asChild
        >
          <DropdownMenuTrigger>
            {header.isPlaceholder
              ? null
              : flexRender(
                column.columnDef.header,
                header.getContext()
              )}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='size-3 mt-px' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='size-3 mt-px' />
            ) : (
              canSort ? <ChevronsUpDownIcon className='size-3 mt-px' /> : (
                selectedValues.size
                  ? (
                    <Badge className='size-4 rounded-full p-0 flex justify-center items-center text-[10px] text-center'>
                      {selectedValues.size > 9 ? '+9' : selectedValues.size}
                    </Badge>)
                  : <ChevronDownIcon className='size-3 mt-px' />
              )
            )}
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent align="start">
          {filterableColumn && filterableColumn?.options && (
            <>
              <Command>
                {filterableColumn.options.length > 7 && <CommandInput placeholder={TC.FILTERS.FILTER_PLACEHOLDER} />}
                <CommandList className="max-h-full">
                  <CommandEmpty className='text-muted-foreground text-sm p-4'>{TC.FILTERS.FILTER_EMPTY}</CommandEmpty>
                  <ScrollArea className='flex max-h-52 flex-col overflow-y-auto'>
                    <CommandGroup>
                      {filterableColumn.options.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                          <CommandItem
                            key={option.value}
                            className='cursor-pointer'
                            onSelect={() => {
                              if (isSingleSelection) {
                                selectedValues.clear()
                                selectedValues.add(option.value)
                              } else {
                                if (isSelected) {
                                  selectedValues.delete(option.value)
                                } else {
                                  selectedValues.add(option.value)
                                }
                              }
                              const filterValues = Array.from(selectedValues)
                              column?.setFilterValue(
                                filterValues.length ? filterValues : undefined
                              )
                            }}
                          >
                            <div
                              className={cn(
                                'flex size-4 items-center justify-center rounded-sm border border-primary cursor-pointer',
                                isSingleSelection && 'rounded-full outline outline-offset-1',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50 [&_svg]:invisible'
                              )}
                            >
                              <CheckIcon className="size-4" />
                            </div>
                            {option.icon && (
                              <option.icon className="size-4 text-muted-foreground" />
                            )}
                            <span>{option.label}</span>
                            {option.count && (
                              <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                {option.count}
                              </span>
                            )}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </ScrollArea>
                  {selectedValues.size > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => column?.setFilterValue(undefined)}
                          className="justify-center text-center cursor-pointer"
                        >
                          {TC.FILTERS.CLEAR_FILTER}
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
              <DropdownMenuSeparator />
            </>
          )}
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                {TC.FILTERS.SORT_ASCENDING}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                {TC.FILTERS.SORT_DESCENDING}
              </DropdownMenuItem>
              {column.getIsSorted() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => column.clearSorting()}>
                    <RotateCcwIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {TC.COLUMNS.RESET_BUTTON}
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
          {canHide && canSort && <DropdownMenuSeparator />}
          {canHide && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
              {TC.FILTERS.HIDE_COLUMN}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
