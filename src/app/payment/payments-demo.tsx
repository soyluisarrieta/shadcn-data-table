import { paymentsColumns, Payment } from '@/app/payment/payments-columns'
import { DataTable, DataTableActions } from '@/components/commons/data-table/data-table'
import { PAYMENT_MOCK } from '@/app/payment/payments-mock'
import { useEffect, useState } from 'react'
import { TestTubeDiagonalIcon } from 'lucide-react'

export default function Payments () {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(()=>{
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
      }
    ]
  }

  return (
    <DataTable
      columns={paymentsColumns}
      data={payments}
      actions={dataTableActions}
    />
  )
}
