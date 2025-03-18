import { DataTableColumnVisibility } from '@/components/commons/data-table/data-table-column-visibility'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { SearchIcon, XCircleIcon } from 'lucide-react'

interface DataTableToolBarProps <TData> {
  table: Table<TData>;
  hideSearch?: boolean
}

export default function DataTableToolbar<TData> ({ table, hideSearch = false }: DataTableToolBarProps<TData>) {
  const isSearched  = table.getState().globalFilter

  return (
    <div className="flex items-center py-4">
      {!hideSearch && (
        <div className="relative flex-1 w-full lg:max-w-sm">
          <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="w-full px-9"
            placeholder="Search..."
            value={isSearched ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
          {isSearched && (
            <Button
              className="h-8 px-2 lg:px-2 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
              variant="link"
              size="icon"
              onClick={() => {
                table.setGlobalFilter('')
                table.resetColumnFilters()
              }}
            >
              <XCircleIcon />
            </Button>
          )}
        </div>
      )}
      <DataTableColumnVisibility table={table} />
    </div>
  )
}
