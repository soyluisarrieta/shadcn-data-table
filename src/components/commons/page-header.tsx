import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: {
    add: {
      label?: string
      onClick: () => void
    }
  }
}

export default function PageHeader ({ title, description, actions  }: PageHeaderProps) {
  return (
    <div className='flex justify-between items-end mb-4'>
      <div className='space-y-1'>
        <p className='text-2xl font-semibold'>{title}</p>
        {description && <p className='text-sm font-light text-muted-foreground'>{description}</p>}
      </div>
      <div className='flex items-center gap-1'>
        <Button
          onClick={actions?.add?.onClick}
        >
          <PlusIcon />
          {actions?.add?.label ?? 'Add'}
        </Button>
      </div>
    </div>
  )
}
