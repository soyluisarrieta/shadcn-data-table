import type { CustomColumnDef } from '@/components/data-table/data-table-types'
import type { Row, Table } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export function DataTableColumnSelection<TData> (): CustomColumnDef<TData> {
  return {
    id: 'select',
    width: 'auto',
    header: ({ table }: { table: Table<TData> }) => (
      <Checkbox
        className='ml-3 mr-2'
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
