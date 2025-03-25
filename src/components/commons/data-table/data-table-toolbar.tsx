import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import type { CustomColumnDef } from '@/components/commons/data-table/data-table-types'
import { type Column, type Table } from '@tanstack/react-table'
import { type DateValue, DatePicker } from '@/components/commons/date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings2Icon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
        <SelectValue placeholder="Global" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Search by</SelectLabel>
          <SelectSeparator />
          <SelectItem value="all">Global</SelectItem>
          {columns.map((column) => {
            if (!column.getCanFilter()) { return null }
            const col = column.columnDef as CustomColumnDef<TData>
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
        placeholder="Search..."
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
  table: Table<TData>
}) {
  return (
    <DropdownMenu>
      <Button
        variant="outline"
        className="ml-auto flex"
        asChild
      >
        <DropdownMenuTrigger>
          <Settings2Icon />
          View
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id !== 'select' && column.id !== 'actions')
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className={cn('capitalize', !column.getIsVisible() && 'line-through')}
                disabled={!column.getCanHide()}
                checked={column.getIsVisible()}
                onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTableLeftToolbar<TData> ({
  table
}: {
  table: Table<TData>
}) {
  const [searchBy, setSearchBy] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    table.resetGlobalFilter()
    table.resetColumnFilters()
    if (searchBy === 'all') {
      table.setGlobalFilter(searchValue)
    } else {
      table.getColumn(searchBy)?.setFilterValue(searchValue)
    }
  }, [table, searchBy, searchValue])

  return (
    <div className='flex-1'>
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
    </div>
  )
}

function DataTableRightToolbar<TData> ({
  table
}: {
  table: Table<TData>
}) {
  const [dateFilter, setDateFilter] = useState<DateValue>()

  useEffect(() => {
    table.resetGlobalFilter()
    table.resetColumnFilters()
    if (dateFilter) {
      table.getColumn('date')?.setFilterValue(dateFilter)
    }
  }, [dateFilter, table])

  return (
    <div className='hidden lg:flex gap-1'>
      <DatePicker
        onDateChange={(date) => setDateFilter(date)}
        onReset={() => { setDateFilter(undefined) }}
      />
      <DataTableDropdownView table={table} />
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
