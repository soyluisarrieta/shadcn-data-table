import { paymentsColumns, Payment } from '@/app/payment/payments-columns'
import { DataTable } from '@/components/commons/data-table/data-table'
import { PAYMENT_MOCK } from '@/app/payment/payments-mock'
import { useCallback, useEffect, useState } from 'react'
import { TestTubeDiagonalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { filterableColumns } from '@/app/payment/payments-filters'
import PageHeader from '@/components/commons/page-header'
import type { DataTableActions } from '@/components/commons/data-table/data-table-types'

export default function Payments () {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setPayments(PAYMENT_MOCK)
      }, 1000 * 0)
    }

    fetchData()
  },[])

  const dataTableActions: DataTableActions<Payment> = {
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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <div>
      <PageHeader
        title='Payments'
        description='This is what my data table would look like if I received donations.'
        actions={{
          add: {
            label: 'Add Payments',
            onClick: () => alert('Add')
          },
          export: {
            label: 'Export',
            onClick: (format) => alert('Export payments.' + format)
          },
          copy: {
            onClick: () => {
              const text = 'Payments Number: ' + Math.floor(Math.random() * 100)
              copyToClipboard(text)
              console.log(text)
            }
          }
        }}
      />
      <DataTable
        columns={paymentsColumns}
        data={payments}
        filterableColumns={filterableColumns}
        actions={dataTableActions}
      />
    </div>
  )
}
