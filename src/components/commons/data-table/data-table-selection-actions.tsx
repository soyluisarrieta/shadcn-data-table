import { DataTableActions, SelectionActionProps } from '@/components/commons/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table } from '@tanstack/react-table'
import { TrashIcon, XIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'

interface DataTableActionsProps<TData> {
  table: Table<TData>;
  selectedRows: number;
  actions: DataTableActions<TData>
}

export default function DataTableSelectionActions<TData> ({ table, selectedRows, actions }: DataTableActionsProps<TData>) {
  if (selectedRows === 0) return null
  const { onRemoveRows, customActions } = actions

  return (
    <div className='h-0 row-selection-actions flex sticky bottom-1 -translate-y-px z-10 -scale-100'>
      <div className='h-fit py-1.5 px-2.5 text-sm border rounded-md bg-popover mx-auto -scale-100 flex items-center'>
        <div className='flex items-center gap-2 pr-3'>
          <Checkbox className='pointer-events-none' checked />
          <span className='font-semibold'>{selectedRows} item{selectedRows > 1 && 's'}</span>
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
                <span className='font-semibold'>Remove all</span>
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
            <XIcon /> Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
