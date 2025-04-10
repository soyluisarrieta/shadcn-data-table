import type { CustomColumnDef } from '@/components/data-table/data-table-types'
import type { Row, Table } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DATA_TABLE_TEXT_CONTENT as TC } from '@/components/data-table/data-table-text-content'
import { MinusIcon } from 'lucide-react'
import type { DataTableActions, SelectionActionProps } from '@/components/data-table/data-table-types'
import { Button } from '@/components/ui/button'
import { TrashIcon, XIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'

interface DataTableActionsProps<TData> {
  table: Table<TData>;
  selectedRows: number;
  actions: DataTableActions<TData>
}

export function DataTableSelectionActions<TData> ({ table, selectedRows, actions }: DataTableActionsProps<TData>) {
  if (selectedRows === 0) return null
  const { onRemoveRows, customActions } = actions

  return (
    <div className='h-0 row-selection-actions flex fixed lg:sticky left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 bottom-1 -translate-y-2 z-10 -scale-100'>
      <div className='h-fit py-1.5 px-2.5 text-sm border rounded-md bg-popover mx-auto -scale-100 flex items-center shadow-lg'>
        <div className='flex items-center gap-2 pr-3 whitespace-nowrap'>
          <Checkbox className='pointer-events-none' checked />
          <span className='text-muted-foreground'>
            {selectedRows === 1
              ? TC.SELECTION.ITEMS_SELECTED.replace('{count}', selectedRows.toString())
              : TC.SELECTION.ITEMS_SELECTED_PLURAL.replace('{count}', selectedRows.toString())
            }
          </span>
        </div>
        <div className='w-px h-6 mx-2 bg-border' />
        {customActions?.map((action, i) => {
          const rows =  table.getSelectedRowModel().flatRows.map((row) => row.original)
          if ('component' in action && action.component) {
            return <Fragment key={i}>{action.component(rows, table.resetRowSelection)}</Fragment>
          }

          const { label, icon: Icon, onClick } = action as SelectionActionProps<TData>
          return (
            <Fragment key={i}>
              <div className='flex items-center gap-2 mx-0'>
                <Button
                  variant='ghost'
                  size={label ? 'sm' : 'icon'}
                  onClick={() => onClick(rows, table.resetRowSelection)}
                >
                  {Icon && <Icon />}
                  {label && <span className='font-semibold'>{label}</span>}
                </Button>
              </div>
              <div className='w-px h-6 mx-2 bg-border' />
            </Fragment>
          )
        })}
        {onRemoveRows && (
          <>
            <div className='flex items-center gap-2 mx-0'>
              <Button
                className='hover:bg-destructive hover:text-destructive-foreground'
                variant='ghost'
                size='sm'
                onClick={() => onRemoveRows(
                  table
                    .getSelectedRowModel()
                    .flatRows
                    .map((row) => row.original),
                  table.resetRowSelection
                )}
              >
                <TrashIcon />
                <span className='font-semibold'>{TC.SELECTION.REMOVE_ALL_BUTTON}</span>
              </Button>
            </div>
            <div className='w-px h-6 mx-2 bg-border' />
          </>
        )}
        <div className='flex items-center gap-2 mx-0'>
          <Button
            className='gap-1.5'
            variant='secondary'
            size='sm'
            onClick={() => table.resetRowSelection()}
          >
            <XIcon /> {TC.SELECTION.CANCEL_BUTTON}
          </Button>
        </div>
      </div>
    </div>
  )
}

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
          <MinusIcon className='absolute size-3 text-foreground pointer-events-none' />
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
