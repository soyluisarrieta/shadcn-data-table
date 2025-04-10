import type { CustomColumnDef } from '@/components/data-table/data-table-types'
import type { Row, Table } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'
import { MinusIcon } from 'lucide-react'

export function DataTableColumnSelection<TData> (): CustomColumnDef<TData> {
  return {
    id: 'select',
    width: 'auto',
    header: ({ table }: { table: Table<TData> }) => (
      <div className='relative flex justify-center items-center pl-3 pr-2'>
        <Checkbox
          className='relative'
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={TC.FILTERS.SELECT_ALL}
        />
        {table.getIsSomePageRowsSelected() &&
          <MinusIcon className='absolute size-3 text-foreground' />
        }
      </div>
    ),
    cell: ({ row }: { row: Row<TData> }) => (
      <Checkbox
        className='mr-2'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={TC.FILTERS.SELECT_ALL}
      />
    ),
    enableSorting: false,
    enableHiding: false
  }
}
