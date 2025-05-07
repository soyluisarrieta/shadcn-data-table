import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { defineColumns } from '@/components/data-table/data-table-utils'

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  date: string;
  category: 'Groceries' | 'Utilities' | 'Entertainment' | 'Travel';
  type: 'Income' | 'Expense';
  notes?: string;
}

export const paymentsColumns = defineColumns<Payment>([
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false
  },
  {
    accessorKey: 'email',
    enableHiding: false,
    header: 'Email'
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    width: '100%',
    minWidth: 300
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category: string = row.getValue('category')
      return <div className='outline outline-primary/20 text-xs rounded-full px-3 py-1'>
        {category}
      </div>
    }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type: string = row.getValue('type')
      return <div className='flex items-center gap-2'>
        {type === 'Income'
          ? <TrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400/80" />
          : <TrendingDownIcon className="h-4 w-4 text-red-500 dark:text-red-400/80" />
        }
        {type}
      </div>
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

      const type = row.getValue('type')
      const color = type === 'Income'
        ? 'text-green-500 dark:text-green-400/80'
        : 'text-red-500 dark:text-red-400/80'
      return <div className={color}>{formatted}</div>
    }
  },
  {
    accessorKey: 'date',
    width: 'auto',
    minWidth: 110,
    header: 'Date',
    searchable: false,
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
      return <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
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
])
