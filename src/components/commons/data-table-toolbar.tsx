import { DataTableColumnVisibility } from '@/components/commons/data-table-column-visibility'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'

interface DataTableToolBarProps <TData> {
  table: Table<TData>
}

export default function DataTableToolbar<TData> ({ table }: DataTableToolBarProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter emails..."
        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('email')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <DataTableColumnVisibility table={table} />
    </div>
  )
}
