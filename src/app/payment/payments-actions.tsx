import { Button } from '@/components/ui/button'
import { TestTubeDiagonalIcon } from 'lucide-react'
import type { Payment } from '@/app/payment/payments-columns'
import type { DataTableActions } from '@/components/commons/data-table/data-table-types'

export const paymentsActions: DataTableActions<Payment> = {
  onExport: (rows, format) => {
    console.log('Export:', rows, format)
    alert(`Exported ${rows.length} rows as ${format}`)
  },

  onRemoveRows: (rows, cleanRowSelection) => {
    console.log('Remove rows:',rows)
    cleanRowSelection()
  },

  customActions: [
    {
      label: 'Button 1',
      icon: TestTubeDiagonalIcon,
      onClick: (rows, cleanRowSelection) => {
        alert('Button 1 clicked')
        console.log('Rows:', rows)
        console.log('Selection cleaner:', typeof cleanRowSelection)
      }
    },
    {
      component: (rows, cleanRowSelection) => (
        <Button
          size='sm'
          onClick={() => {
            alert('Button 2 clicked')
            console.log('Rows:', rows)
            console.log('Selection cleaner:', typeof cleanRowSelection)
          }}
        >
          <TestTubeDiagonalIcon />Button 2
        </Button>
      )
    }
  ]
}
