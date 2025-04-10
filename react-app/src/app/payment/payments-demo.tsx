import React from 'react'
import { type Payment, paymentsColumns } from '@/app/payment/payments-columns'
import { DataTable } from '@/components/data-table/data-table'
import { PAYMENT_MOCK } from '@/app/payment/payments-mock'
import { filterableColumns } from '@/app/payment/payments-filters'
import { paymentsActions } from '@/app/payment/payments-actions'
import { PageHeader } from '@/components/page-header'

const SIMULATED_MOCK = [...PAYMENT_MOCK]
  .sort(() => Math.random() - 0.5)
  .slice(0, 10)

export default function DemoPayments () {
  const [payments, setPayments] = React.useState<Payment[]>()

  React.useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setPayments(PAYMENT_MOCK)
      }, 1000)
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
        mock={SIMULATED_MOCK}
        isLoading={!payments}
        tabs={{
          defaultTab: 'all',
          className: '',
          tabs: [
            { value: 'all', label: 'All' },
            { 
              value: 'recent', 
              label: 'Recent',
              columnVisibility: { category: false },
              // Simulated recent payments in April
              filter: (payment: Payment) => {
                const date = new Date(payment.date)
                return date.getMonth() === 3
              }
            },
            { 
              value: 'income', 
              label: 'Income',
              columnVisibility: { type: false },
              filter: (payment: Payment) => payment.type === 'Income',
            },
            { 
              value: 'expense', 
              label: 'Expense',
              columnVisibility: { status: false,  type: false },
              filter: (payment: Payment) => payment.type === 'Expense',
            }
          ]
        }}
      />
    </div>
  )
}
