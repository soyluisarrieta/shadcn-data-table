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
import type { CustomColumnDef, ExportFormat, FilterableColumn } from '@/components/data-table/data-table-types'
import { flexRender, type Column, type Table } from '@tanstack/react-table'
import { type DateValue, DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckIcon, CopyIcon, DownloadIcon, ListFilterIcon, RotateCwIcon, SettingsIcon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { FILTERS, FilterType } from '@/components/data-table/data-table-filters'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'

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
            if (col.filterFn === FILTERS[FilterType.DatePicker]) { return null }
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
        <DropdownMenuLabel>{TC.COLUMNS.DROPDOWN_LABEL}</DropdownMenuLabel>
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

function DataTableLeftToolbar<TData> ({
  table,
  filterableColumns
}: {
  table: Table<TData>;
  filterableColumns?: FilterableColumn<TData>[];
}) {
  const [searchBy, setSearchBy] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    table.setGlobalFilter({ searchBy, searchValue })
  }, [searchBy, searchValue, table])

  const headers = table
    .getFlatHeaders()
    .filter(({ id }) => (
      filterableColumns?.find(({ columnKey, type }) =>
        columnKey === id && type !== FilterType.DatePicker
      )))

  return (
    <div className='flex-1 flex gap-2'>
      <div className='flex'>
        <DataTableSelectSearch
          columns={table.getAllLeafColumns()}
          value={searchBy}
          onValueChange={setSearchBy}
        />
        <DataTableSearchInput
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </div>
      <div className='rounded-lg flex items-center gap-1 px-0.5'>
        <DropdownMenu>
          <Button variant='ghost' asChild>
            <DropdownMenuTrigger className='border border-dashed'>
              <ListFilterIcon />
              Add filter
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-xs text-muted-foreground font-normal'>
                Select column
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {headers.map(columnHeader => {
                const columnName = flexRender(
                  columnHeader.column.columnDef.header,
                  columnHeader.getContext()
                )
                return (
                  <Button
                    key={columnHeader.id}
                    className={'w-full flex justify-between items-center capitalize p-2 text-sm'}
                    variant='ghost'
                  >
                    {columnName}
                  </Button>
                )
              })}
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
  const [dateFilter, setDateFilter] = useState<DateValue>()
  const [openExportPopover, setOpenExportPopover] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [filteredOnly, setFilteredOnly] = useState(true)
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    table.setColumnFilters(oldFilters => {
      const otherFilters = oldFilters.filter(filter => filter.id !== 'date')
      if (dateFilter) {
        return [...otherFilters, { id: 'date', value: dateFilter }]
      }
      return otherFilters
    })
  }, [dateFilter, table])

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
    <div className='hidden lg:flex gap-1'>
      <DatePicker
        value={dateFilter}
        onValueChange={setDateFilter}
        onReset={() => { setDateFilter(undefined) }}
      />
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
                <DownloadIcon className="text-muted-foreground" size={16} strokeWidth={2} />
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
    <div className="flex items-center py-3">
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
