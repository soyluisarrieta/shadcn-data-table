import React from 'react'
import { type Payment, paymentsColumns } from '@/app/payment/payments-columns'
import { DataTable } from '@/components/commons/data-table/data-table'
import { PAYMENT_MOCK } from '@/app/payment/payments-mock'
import { filterableColumns } from '@/app/payment/payments-filters'
import { paymentsActions } from '@/app/payment/payments-actions'
import { PageHeader } from '@/components/commons/page-header'

export default function DemoPayments () {
  const [payments, setPayments] = React.useState<Payment[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setPayments(PAYMENT_MOCK)
      }, 1000 * 0)
    }

    fetchData()
  },[])

  return (
    <div>
      <PageHeader
        title='Payments'
        description='This is what my data table would look like if I received donations.'
        actions={{
          add: {
            label: 'Add Payments',
            onClick: () => alert('Add')
          }
        }}
      />
      <DataTable
        columns={paymentsColumns}
        data={payments}
        filterableColumns={filterableColumns}
        actions={paymentsActions}
      />
    </div>
  )
}
