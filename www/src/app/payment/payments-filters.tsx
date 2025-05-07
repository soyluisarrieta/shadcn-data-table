import type { Payment } from '@/app/payment/payments-columns'
import { defineFilters } from '@/components/data-table/data-table-utils'
import { CheckCircle2Icon, CircleXIcon, ClockFadingIcon, TimerIcon } from 'lucide-react'

export const filterableColumns = defineFilters<Payment>([
  {
    columnKey: 'status',
    label: 'Status',
    type: 'MULTI_SELECTION',
    options: [
      { label: 'pending', value: 'pending', icon: ClockFadingIcon  },
      { label: 'processing', value: 'processing', icon: TimerIcon },
      { label: 'success', value: 'success', icon: CheckCircle2Icon },
      { label: 'failed', value: 'failed', icon: CircleXIcon }
    ]
  },
  {
    columnKey: 'category',
    label: 'Category',
    type: 'MULTI_SELECTION',
    options: [
      { label: 'Groceries', value: 'Groceries' },
      { label: 'Utilities', value: 'Utilities' },
      { label: 'Entertainment', value: 'Entertainment' },
      { label: 'Travel', value: 'Travel' }
    ]
  },
  {
    columnKey: 'type',
    label: 'Type',
    type: 'SINGLE_SELECTION',
    options: [
      { label: 'Income', value: 'Income' },
      { label: 'Expense', value: 'Expense' }
    ]
  },
  {
    columnKey: 'amount',
    label: 'Amount Range',
    type: 'SINGLE_SELECTION',
    options: [
      { label: 'Less than $10k', value: 'lessThan10k' },
      { label: '$10k - $50k', value: '10kto50k' },
      { label: '$50k - $100k', value: '50kto100k' },
      { label: 'More than $100k', value: 'moreThan100k' }
    ],
    filterFn: ({ row, filterValue }) => {
      const value = filterValue?.[0] ?? null
      const amount = parseFloat(row.getValue('amount'))

      if (value === 'lessThan10k') {
        return amount < 10000
      } else if (value === '10kto50k') {
        return amount >= 10000 && amount <= 50000
      } else if (value === '50kto100k') {
        return amount >= 50000 && amount <= 100000
      } else if (value === 'moreThan100k') {
        return amount > 100000
      }

      return true
    }
  },
  {
    columnKey: 'date',
    label: 'Time period',
    type: 'SINGLE_SELECTION',
    options: [
      { label: 'Last day', value: 'today' },
      { label: 'Last 15 days', value: '15days' },
      { label: 'Last 30 days', value: '30days' },
      { label: 'Last month', value: 'month' },
      { label: 'Last quarter', value: 'quarter' },
      { label: 'Last year', value: 'year' }
    ],
    filterFn: ({ row, columnId, filterValue }) => {
      if (!filterValue?.length) return true

      const value = filterValue?.[0] ?? null
      const date = new Date()
      date.setHours(0, 0, 0, 0)

      if (value === 'today') {
        date.setDate(date.getDate() - 1)
      } else if (value === '15days') {
        date.setDate(date.getDate() - 15)
      } else if (value === '30days') {
        date.setDate(date.getDate() - 30)
      } else if (value === 'month') {
        date.setMonth(date.getMonth() - 1)
      } else if (value === 'quarter') {
        date.setMonth(date.getMonth() - 3)
      } else if (value === 'year') {
        date.setFullYear(date.getFullYear() - 1)
      }

      return new Date(row.getValue(columnId)) >= date
    }
  },
  {
    columnKey: 'date',
    label: 'Date',
    type: 'DATE_PICKER'
  }
])
