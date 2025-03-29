import { Button } from '@/components/ui/button'
import { TestTubeDiagonalIcon } from 'lucide-react'
import type { Payment } from '@/app/payment/payments-columns'
import type { DataTableActions } from '@/components/commons/data-table/data-table-types'
import { generateTablePDF, type PDFColumn } from '@/lib/pdf-utils'

export const paymentsActions: DataTableActions<Payment> = {
  onExport: (rows, format) => {
    if (format === 'pdf') {
      const columns: PDFColumn[] = [
        { id: 'email', header: 'Email', width: 60 },
        { id: 'status', header: 'Status', width: 30 },
        { id: 'amount', header: 'Amount', width: 30 },
        { id: 'date', header: 'Date', width: 40 }
      ]

      generateTablePDF(rows, columns, {
        title: 'Payments Report',
        filename: 'payments-report.pdf'
      })

      return null
    }

    if (format === 'csv') {
      // generate CSV file here
    }

    if (format === 'xlsx') {
      // generate Excel file here
    }

    if (format === 'json') {
      // generate JSON file here
    }

    alert(`[SIMULATION]:\nExported ${rows.length} rows as ${format}`)
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
