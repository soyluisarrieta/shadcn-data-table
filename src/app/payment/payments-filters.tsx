import { Payment } from '@/app/payment/payments-columns'
import { FilterableColumn } from '@/components/commons/data-table/data-table'
import { FilterType } from '@/components/commons/data-table/data-table-filters'
import { CheckCircle2Icon, CircleXIcon, ClockFadingIcon, TimerIcon } from 'lucide-react'

export const filterableColumns: FilterableColumn<Payment>[]  = [
  {
    columnKey: 'status',
    label: 'Status',
    type: 'single-selection',
    options: [
      { label: 'pending', value: 'pending', icon: ClockFadingIcon  },
      { label: 'processing', value: 'processing', icon: TimerIcon },
      { label: 'success', value: 'success', icon: CheckCircle2Icon },
      { label: 'failed', value: 'failed', icon: CircleXIcon }
    ]
  },
  {
    columnKey: 'email',
    label: 'Email',
    type: FilterType.MultiSelection,
    options: [
      { label: 'user 17', value: 'user17@example.com' },
      { label: 'user 18', value: 'user18@example.com' },
      { label: 'user 19', value: 'user19@example.com' },
      { label: 'user 20', value: 'user20@example.com' },
      { label: 'user 21', value: 'user21@example.com' },
      { label: 'user 22', value: 'user22@example.com' },
      { label: 'user 23', value: 'user23@example.com' },
      { label: 'user 24', value: 'user24@example.com' },
      { label: 'user 25', value: 'user25@example.com' },
      { label: 'user 26', value: 'user26@example.com' },
      { label: 'user 27', value: 'user27@example.com' }
    ]
  },
  {
    columnKey: 'date',
    label: 'Date',
    type: 'date'
  }
]
