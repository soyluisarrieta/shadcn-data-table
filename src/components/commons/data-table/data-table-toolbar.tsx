import { CustomColumnDef } from '@/components/commons/data-table/data-table'
import { DataTableColumnVisibility } from '@/components/commons/data-table/data-table-column-visibility'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table } from '@tanstack/react-table'
import { SearchIcon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DataTableToolBarProps <TData> {
  table: Table<TData>;
  hideSearch?: boolean
}

export default function DataTableToolbar<TData> ({ table, hideSearch }: DataTableToolBarProps<TData>) {
  const [searchBy, setSearchBy] = useState({ column: 'all', value: '' })

  useEffect(() => {
    const { column, value } = searchBy
    table.resetGlobalFilter()
    table.resetColumnFilters()
    if (column === 'all') {
      table.setGlobalFilter(value)
    } else {
      table.getColumn(column)?.setFilterValue(value)
    }
  }, [searchBy, table])

  return (
    <div className="flex items-center py-4">
      {!hideSearch && (
        <div className='flex'>
          <Select value={searchBy.column} onValueChange={(value) => setSearchBy((prev) => ({ ...prev, column: value }))}>
            <SelectTrigger className="w-[120px] rounded-r-none border-r-0 bg-muted/50 text-muted-foreground">
              <SelectValue placeholder="Global" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Global</SelectItem>
              <SelectSeparator />
              {table.getAllColumns().map((column) => {
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
            </SelectContent>
          </Select>
          <div className="relative flex-1 w-full lg:max-w-sm">
            <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              className="w-full px-9 rounded-l-none"
              placeholder="Search..."
              value={searchBy.value}
              onChange={(e) => setSearchBy((prev) => ({ ...prev, value: e.target.value }))}
            />
            {searchBy.value && (
              <Button
                className="h-8 px-2 lg:px-2 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                variant="link"
                size="icon"
                onClick={() => {
                  setSearchBy((prev) => ({ ...prev, value: '' }))
                }}
              >
                <XCircleIcon />
              </Button>
            )}
          </div>
        </div>
      )}
      <DataTableColumnVisibility table={table} />
    </div>
  )
}
