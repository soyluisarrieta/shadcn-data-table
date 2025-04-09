import type { CustomColumnDef } from '@/components/commons/data-table/data-table-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon } from 'lucide-react'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  date: string
}

export const paymentsColumns: CustomColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false
  },
  {
    accessorKey: 'email',
    width: '100%',
    minWidth: 300,
    enableHiding: false,
    header: 'Email'
  },
  {
    accessorKey: 'date',
    width: 'auto',
    enableHiding: false,
    header: 'Fecha',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
      return <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    }
  },
  {
    accessorKey: 'amount',
    label: 'Amount',
    align: 'right',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    }
  },
  {
    id: 'actions',
    width: 'auto',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <Button variant="ghost" className="size-8 p-0" asChild>
            <DropdownMenuTrigger>
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
          </Button>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
