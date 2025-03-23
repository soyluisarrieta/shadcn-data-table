import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronDownIcon, CopyIcon, DownloadIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToggleGroupFormat = 'pdf' | 'csv' | 'json' | 'xlsx'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: {
    add: {
      label?: string
      onClick: () => void
    },
    export: {
      label?: string
      onClick: (format: ToggleGroupFormat) => void
    },
    copy?: {
      label?: string
      onClick: () => void
    }
  }
}

export default function PageHeader ({ title, description, actions  }: PageHeaderProps) {
  const [toggleGroupFormat, setToggleGroupFormat] = useState<ToggleGroupFormat>('pdf')
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
  },[hasCopied])

  return (
    <div className='flex justify-between items-end mb-4'>
      <div className='space-y-1'>
        <p className='text-2xl font-semibold'>{title}</p>
        {description && <p className='text-sm font-light text-muted-foreground'>{description}</p>}
      </div>
      <div className='flex items-center gap-1'>
        <div>
          <Button
            className="rounded-none first:rounded-s-lg last:rounded-e-lg"
            variant='outline'
            onClick={() => actions?.export?.onClick('pdf')}
          >
            <DownloadIcon className="text-muted-foreground" size={16} strokeWidth={2} />
            {actions?.export?.label ?? 'Export'}
          </Button>

          <Popover>
            <Button
              className="rounded-none first:rounded-s-lg last:rounded-e-lg border-l-0"
              variant='outline'
              size="icon"
              asChild
            >
              <PopoverTrigger>
                <ChevronDownIcon size={16} strokeWidth={2} />
              </PopoverTrigger>
            </Button>
            <PopoverContent className='w-auto p-0' align='end'>
              <div className="space-y-3">
                <h4 className="font-medium leading-none px-4 mt-4">Formats</h4>
                <ToggleGroup
                  className='px-4 [&_button]:px-4'
                  value={toggleGroupFormat}
                  type="single"
                  onValueChange={(format: ToggleGroupFormat) => setToggleGroupFormat(format)}
                  variant='outline'
                >
                  <ToggleGroupItem value="pdf">PDF</ToggleGroupItem>
                  <ToggleGroupItem value="csv">CSV</ToggleGroupItem>
                  <ToggleGroupItem value="xlsx">EXCEL</ToggleGroupItem>
                  <ToggleGroupItem value="json">JSON</ToggleGroupItem>
                </ToggleGroup>

                <Separator />

                <div className={cn('w-full px-4 mb-3 flex justify-between gap-1', !actions?.copy && 'justify-end')}>
                  {actions?.copy && (
                    <Button
                      size='sm'
                      variant='ghost'
                      disabled={hasCopied}
                      onClick={() => {
                        actions?.copy?.onClick()
                        setHasCopied(true)
                      }}
                    >
                      {hasCopied
                        ? (<><CheckIcon />{'Copied!'}</>)
                        : (<><CopyIcon />{actions?.copy?.label ?? 'Copy JSON'}</>)
                      }
                    </Button>
                  )}
                  <Button
                    size='sm'
                    onClick={() => actions?.export?.onClick(toggleGroupFormat)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
