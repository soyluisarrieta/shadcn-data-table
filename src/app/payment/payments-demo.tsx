import { columns, Payment } from '@/app/payment/payments-columns'
import { DataTable } from '@/components/commons/data-table'
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

  return (
    <DataTable columns={columns} data={payments} />
  )
}
