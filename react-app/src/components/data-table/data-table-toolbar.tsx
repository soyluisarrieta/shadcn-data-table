import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ListFilterIcon,
  RotateCwIcon,
  SettingsIcon,
  XCircleIcon,
  TrashIcon,
  XIcon
} from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import type {
  CustomColumnDef,
  ExportFormat,
  FilterColumnExtended as FilterColumnExt
} from '@/components/data-table/data-table-types'
import { type Column, type Table } from '@tanstack/react-table'
import { DatePicker } from '@/components/data-table/data-table-date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FILTERS } from '@/components/data-table/filters'
import { getFilterFn } from '@/components/data-table/data-table-utils'

function DataTableSelectSearch<TData> ({
  columns,
  value,
  onValueChange
}: {
  columns: Column<TData>[],
  value: string,
  onValueChange: (column: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px] rounded-r-none border-r-0 bg-muted/50 text-muted-foreground">
        <SelectValue placeholder={TC.SEARCH.GLOBAL_SEARCH} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{TC.SEARCH.SEARCH_BY_LABEL}</SelectLabel>
          <SelectSeparator />
          <SelectItem value="all">{TC.SEARCH.GLOBAL_SEARCH}</SelectItem>
          {columns.map((column) => {
            if (!column.getCanFilter()) { return null }
            const col = column.columnDef as CustomColumnDef<TData>
            if (col.filterFn === getFilterFn(FILTERS.DATE_PICKER)) { return null }
            const label = (col?.label) ?? col.header
            if (!label || typeof label !== 'string') {
              throw new Error(`The \`${column.id}\` column header is not a string. Add the \`label\` property if the \`header\` value does not contain a string.`)
            }
            return (
              <SelectItem key={column.id} value={column.id}>
                {label}
              </SelectItem>
            )}
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function DataTableSearchInput ({
  value,
  onValueChange
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="relative flex-1 w-full lg:max-w-72">
      <Input
        className="w-full pr-9 rounded-l-none"
        placeholder={TC.SEARCH.PLACEHOLDER}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
      {value && (
        <Button
          className="h-8 px-2 lg:px-2 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
          variant="link"
          size="icon"
          onClick={() => onValueChange('')}
        >
          <XCircleIcon />
        </Button>
      )}
    </div>
  )
}

function DataTableDropdownView<TData> ({
  table
}: {
  table: Table<TData>,
}) {

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        className="ml-auto flex"
        asChild
      >
        <DropdownMenuTrigger>
          <SettingsIcon />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel className='text-muted-foreground font-normal text-xs'>
          {TC.COLUMNS.DROPDOWN_LABEL}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id !== 'select' && column.id !== 'actions')
          .map((column) => {
            return (
              <div
                key={column.id}
                className='flex justify-between items-center capitalize p-2 text-sm'
              >
                <span className={!column.getIsVisible() ? 'opacity-50' : ''}>{column.id}</span>
                <Switch
                  className='ml-auto scale-90'
                  disabled={!column.getCanHide()}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                />
              </div>
            )
          })}
        {Object.entries(table.getState().columnVisibility).some(([key, value]) => {
          const initialValue = table.initialState.columnVisibility?.[key] ?? true
          return value !== initialValue
        }) && (
          <>
            <DropdownMenuSeparator />
            <Button className='w-full' size='sm' variant='secondary' asChild>
              <DropdownMenuItem onClick={() => table.resetColumnVisibility()}>
                <RotateCwIcon /> {TC.COLUMNS.RESET_BUTTON}
              </DropdownMenuItem>
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTableColumnFilter<TData> ({
  column,
  filter,
  isOpen,
  onOpenChange
}: {
  column: Column<TData>
  filter: FilterColumnExt<TData>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  if (!filter) return null

  const columnFilters = column.getFilterValue() as Record<FilterColumnExt<TData>['id'], any> || {}

  const filterValue = columnFilters[filter.id]
  const selectedValues = new Set(Array.isArray(filterValue) ? filterValue : [])

  const updateFilterValue = (value: any) => {
    const newFilters = { ...columnFilters }

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filter.id]
    } else {
      newFilters[filter.id] = value
    }

    const finalValue = Object.keys(newFilters).length > 0 ? newFilters : undefined
    column.setFilterValue(finalValue)
  }

  if (filter.type === FILTERS.DATE_PICKER) {
    return (
      <DatePicker
        open={isOpen}
        onOpenChange={onOpenChange}
        value={filterValue ?? undefined}
        onValueChange={updateFilterValue}
        onReset={() => updateFilterValue(undefined)}
        placeholder={filter.label}
      />
    )
  }

  const isSingleSelection = filter.type === FILTERS.SINGLE_SELECTION

  // Encontrar la etiqueta de la opción seleccionada para filtros con una sola selección
  let selectedOptionLabel = ''
  if (selectedValues.size === 1 && filter.options) {
    const selectedValue = Array.from(selectedValues)[0]
    const selectedOption = filter.options.find(option => option.value === selectedValue)
    if (selectedOption) {
      selectedOptionLabel = selectedOption.label
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <div className='bg-accent/30 border rounded-lg flex items-center'>
        <Button
          className='bg-accent flex items-center gap-1.5 pr-3'
          variant='ghost'
          size='sm'
          asChild
        >
          <DropdownMenuTrigger>
            <div className='flex items-center gap-1.5'>
              <span className='font-normal opacity-70'>{filter.label}:</span>
              {selectedValues.size >= 0 && (
                <Badge
                  className={cn('flex items-center gap-1 px-2 py-0.5 h-5 text-xs', selectedValues.size > 1 && 'aspect-square')}
                  variant='outline'
                >
                  {selectedValues.size === 1 && selectedOptionLabel ? (
                    <span className='max-w-24 truncate'>{selectedOptionLabel}</span>
                  ) : (
                    <span>
                      {selectedValues.size < 2
                        ? selectedValues.size
                        : '+9'
                      }
                    </span>
                  )}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
        </Button>
        <Button
          className='size-4 p-0 hover:dark:bg-transparent text-muted-foreground mx-1.5'
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.stopPropagation()
            updateFilterValue(undefined)
          }}
        >
          <XIcon />
        </Button>
      </div>
      <DropdownMenuContent className='min-w-44 p-0'>
        <DropdownMenuGroup>
          <Command className='p-0'>
            <CommandInput placeholder='Search option' />
            <CommandList className="max-h-full p-1">
              <CommandEmpty className='text-muted-foreground text-sm p-4'>{TC.FILTERS.FILTER_EMPTY}</CommandEmpty>
              <ScrollArea className='flex max-h-52 flex-col overflow-y-auto'>
                <CommandGroup>
                  {filter.options && filter.options.map((option) => {
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
                          updateFilterValue(filterValues.length > 0 ? filterValues : undefined)
                        }}
                      >
                        <div
                          className={cn(
                            'flex size-4 items-center justify-center rounded-sm border border-primary cursor-pointer mr-2',
                            isSingleSelection && 'rounded-full outline outline-offset-1',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className="size-3.5" />
                        </div>
                        {option.icon && (
                          <option.icon className="size-4 text-muted-foreground mr-1.5" />
                        )}
                        <span className="text-sm">{option.label}</span>
                        {option.count && (
                          <span className="ml-auto flex size-5 items-center justify-center font-mono text-xs bg-muted rounded-full">
                            {option.count}
                          </span>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </ScrollArea>

              <CommandSeparator className='mb-2' />
              <div className='flex justify-between items-center gap-x-2'>
                <Button
                  className='grow font-normal flex items-center gap-1.5'
                  variant="ghost"
                  size='sm'
                  onClick={() => updateFilterValue(undefined)}
                >
                  <RotateCwIcon className='size-3.5 text-muted-foreground' />
                  Reset
                </Button>
                <span className='h-4 border-r' />
                <Button
                  className='grow font-normal flex items-center gap-1.5'
                  variant="ghost"
                  size='sm'
                  onClick={() => updateFilterValue(undefined)}
                >
                  <TrashIcon className='size-3.5 text-muted-foreground' />
                  Delete
                </Button>
              </div>
            </CommandList>
          </Command>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTableLeftToolbar<TData> ({
  table,
  columnFilters
}: {
  table: Table<TData>;
  columnFilters?: FilterColumnExt<TData>[];
}) {
  const [searchBy, setSearchBy] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [openFilterDropdown, setOpenFilterDropdown] = useState<FilterColumnExt<TData>['id']>()
  const [activeFilters, setActiveFilters] = useState<FilterColumnExt<TData>[]>([])

  useEffect(() => {
    table.setGlobalFilter({ searchBy, searchValue })
  }, [searchBy, searchValue, table])

  const leafColumns = useMemo(() => (
    table
      .getAllLeafColumns()
      .filter(({ columnDef }) => (columnDef as CustomColumnDef<TData>)?.searchable)
  ), [table])

  const handleFilterChange = (
    filterId: FilterColumnExt<TData>['id'],
    open: boolean
  ) => {
    if (open) {
      setOpenFilterDropdown(filterId)
    } else if (openFilterDropdown === filterId) {
      setOpenFilterDropdown(undefined)
    }
  }

  return (
    <div className='flex-1 flex flex-col sm:flex-row gap-2'>
      <div className='flex w-full sm:w-auto'>
        <DataTableSelectSearch
          columns={leafColumns}
          value={searchBy}
          onValueChange={setSearchBy}
        />
        <DataTableSearchInput
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </div>
      <div className='rounded-lg flex flex-wrap items-center gap-1 px-0.5 mt-2 sm:mt-0'>
        {activeFilters.map(filter => {
          const column = table.getColumn(filter.columnKey)
          if (!column) return null
          return (
            <DataTableColumnFilter
              key={filter.id}
              column={column}
              filter={filter}
              isOpen={openFilterDropdown === filter.id}
              onOpenChange={(open) => {
                handleFilterChange(filter.id, open)
              }}
            />
          )}
        )}

        <DropdownMenu open={openFilterMenu} onOpenChange={setOpenFilterMenu}>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='whitespace-nowrap border-dashed flex items-center gap-1.5 h-8 text-xs sm:text-sm'
          >
            <DropdownMenuTrigger>
              <ListFilterIcon className='size-4' />
              <span className='hidden sm:inline font-medium'>Add filter</span>
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-xs text-muted-foreground font-normal'>
                Select column
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columnFilters?.map(filter => {
                const column = table.getColumn(filter.columnKey)
                if (!column) return null
                return (
                  <Button
                    key={filter.id}
                    className='w-full flex justify-between items-center capitalize p-2 text-sm'
                    variant='ghost'
                    onClick={() => {
                      const isFilterActive = activeFilters.some(activeFilter => activeFilter.id === filter.id)
                      if (!isFilterActive) {
                        setActiveFilters([...activeFilters, filter])
                      }
                      setOpenFilterMenu(false)
                      handleFilterChange(filter.id, true)
                    }}
                  >
                    {filter.label}
                  </Button>
                )
              })}
              {table.getState().columnFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    className="w-full font-normal flex items-center gap-1.5"
                    variant="ghost"
                    size='sm'
                    onClick={() => table.resetColumnFilters()}
                    asChild
                  >
                    <DropdownMenuItem>
                      <RotateCwIcon className="size-4" />
                      Clear filters
                    </DropdownMenuItem>
                  </Button>
                </>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function DataTableRightToolbar<TData> ({
  table,
  onExport,
  disableCopyJSON = false
}: {
  table: Table<TData>
  onExport?: (data: TData[], format: ExportFormat) => void
  disableCopyJSON?: boolean
}) {
  const [openExportPopover, setOpenExportPopover] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [filteredOnly, setFilteredOnly] = useState(true)
  const [hasCopied, setHasCopied] = useState(false)

  const getRows = () => filteredOnly
    ? table.getFilteredRowModel().flatRows.map(row => row.original)
    : table.getCoreRowModel().flatRows.map(row => row.original)

  const handleCopy = () => {
    const formattedRowsJSON = JSON.stringify(getRows(), null, 2)
    navigator.clipboard.writeText(formattedRowsJSON)
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <div className='flex gap-1 mt-2 sm:mt-0'>
      <DataTableDropdownView table={table} />
      {onExport && (
        <div className='flex items-center'>
          <Popover open={openExportPopover} onOpenChange={setOpenExportPopover}>
            <Button
              className="rounded-none first:rounded-s-lg last:rounded-e-lg"
              variant='outline'
              asChild
            >
              <PopoverTrigger>
                <DownloadIcon size={16} strokeWidth={2} />
              </PopoverTrigger>
            </Button>
            <PopoverContent className='w-auto p-0' align='end'>
              <div className="space-y-3">
                <h4 className="font-medium leading-none px-4 mt-4">{TC.EXPORT.FORMAT_LABEL}</h4>
                <ToggleGroup
                  className='px-3 [&_button]:px-4'
                  value={selectedFormat}
                  type="single"
                  onValueChange={(format: ExportFormat) => setSelectedFormat(format)}
                  variant='outline'
                >
                  <ToggleGroupItem value="pdf">{TC.EXPORT.PDF_LABEL}</ToggleGroupItem>
                  <ToggleGroupItem value="csv">{TC.EXPORT.CSV_LABEL}</ToggleGroupItem>
                  <ToggleGroupItem value="xlsx">{TC.EXPORT.EXCEL_LABEL}</ToggleGroupItem>
                  <ToggleGroupItem value="json">{TC.EXPORT.JSON_LABEL}</ToggleGroupItem>
                </ToggleGroup>

                <div className='flex justify-between items-center gap-2 px-4 text-sm text-mute'>
                  <span>
                    {TC.EXPORT.FILTERED_ONLY_LABEL}
                    <span className='text-xs text-muted-foreground ml-2'>({getRows().length} rows)</span>
                  </span>
                  <Switch
                    checked={filteredOnly}
                    onCheckedChange={setFilteredOnly}
                  />
                </div>

                <Separator />

                <div className={cn('w-full px-4 mb-3 flex justify-between gap-1', disableCopyJSON && 'justify-end')}>
                  {!disableCopyJSON && (
                    <Button
                      size='sm'
                      variant='ghost'
                      disabled={hasCopied}
                      onClick={handleCopy}
                    >
                      {hasCopied
                        ? (<><CheckIcon />{TC.EXPORT.COPIED_MESSAGE}</>)
                        : (<><CopyIcon />{TC.EXPORT.COPY_JSON_BUTTON}</>)
                      }
                    </Button>
                  )}
                  <Button
                    size='sm'
                    onClick={() => {
                      onExport?.(getRows(), selectedFormat)
                      setOpenExportPopover(false)
                    }}
                  >
                    {TC.EXPORT.EXPORT_BUTTON}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

function DataTableToolbar ({
  children
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-3 gap-2">
      {children}
    </div>
  )
}

export {
  DataTableToolbar,
  DataTableLeftToolbar,
  DataTableRightToolbar,
  DataTableSelectSearch,
  DataTableSearchInput,
  DataTableDropdownView
}
