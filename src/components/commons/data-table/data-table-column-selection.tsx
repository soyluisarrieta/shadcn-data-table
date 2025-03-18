import { CustomColumnDef } from '@/components/commons/data-table/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Row, type Table } from '@tanstack/react-table'

export function DataTableColumnSelection<TData> (): CustomColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }: { table: Table<TData> }) => (
      <Checkbox
        className='mr-2'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: Row<TData> }) => (
      <Checkbox
        className='mr-2'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  }
}
