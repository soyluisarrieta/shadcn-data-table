import { flexRender, Header } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, CheckIcon, ChevronDownIcon, ChevronsUpDown, EyeOff, RotateCcwIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { FilterableColumn } from '@/components/commons/data-table/data-table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface DataTableColumnHeaderProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  header:  Header<TData, unknown>
  filterableColumn?: FilterableColumn<TData>
}

export function DataTableColumnHeader<TData> ({
  header,
  className,
  filterableColumn
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

  const unknownValue = column?.getFilterValue()
  const selectedValues = new Set(Array.isArray(unknownValue) ? unknownValue : [])
  const isFilteredColumn = column.getIsSorted() || selectedValues.size

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isFilteredColumn ? 'secondary' : 'ghost'}
            size="sm"
            className={cn('-ml-3 h-8 data-[state=open]:bg-accent text-xs', isFilteredColumn && 'font-bold')}
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
              canSort ? <ChevronsUpDown /> : (
                selectedValues.size
                  ? (
                    <Badge className='size-4 rounded-full p-0 flex justify-center items-center text-[10px] text-center'>
                      {selectedValues.size > 3 ? '+9' : selectedValues.size}
                    </Badge>)
                  : <ChevronDownIcon />)
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">

          {filterableColumn && (
            <>
              <Command>
                {filterableColumn.options.length > 7 && <CommandInput placeholder='Search' />}
                <CommandList className="max-h-full">
                  <CommandEmpty className='text-muted-foreground text-sm p-4'>No results found.</CommandEmpty>
                  <ScrollArea className='flex max-h-52 flex-col overflow-y-auto'>
                    <CommandGroup>
                      {filterableColumn.options.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                          <CommandItem
                            key={option.value}
                            className='cursor-pointer'
                            onSelect={() => {
                              if (isSelected) {
                                selectedValues.delete(option.value)
                              } else {
                                selectedValues.add(option.value)
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
                          Clear filter
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
