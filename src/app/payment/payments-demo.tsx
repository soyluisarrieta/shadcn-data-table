import { paymentsColumns, Payment } from '@/app/payment/payments-columns'
import { DataTable, DataTableActions } from '@/components/commons/data-table/data-table'
import { PAYMENT_MOCK } from '@/app/payment/payments-mock'
import { useEffect, useState } from 'react'

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
    }
  }

  return (
    <DataTable
      columns={paymentsColumns}
      data={payments}
      actions={dataTableActions}
    />
  )
}
