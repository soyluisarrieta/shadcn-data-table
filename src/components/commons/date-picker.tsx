import * as React from 'react'
import { CalendarIcon, ChevronDown, ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isToday,
  isSameDay
} from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  onReset?: () => void
  placeholder?: string
}

export function DatePicker ({ date, onDateChange, onReset, placeholder = 'Pick a date' }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date())
  const [isOpen, setIsOpen] = React.useState(false)
  const [view, setView] = React.useState<'days' | 'years'>('days')

  // Get the current year for the accordion default value
  const currentYear = currentMonth.getFullYear()
  const currentYearValue = `year-${currentYear}`
  const currentMonthIndex = currentMonth.getMonth()

  // Reference to the current year's accordion item
  const currentYearRef = React.useRef<HTMLDivElement>(null)

  // Reset view when popover closes, but only after animation completes
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (!isOpen && view !== 'days') {
      // Delay the view reset until after the popover closing animation completes
      timeoutId = setTimeout(() => {
        setView('days')
      }, 200) // This should match or exceed the popover closing animation duration
    }

    // Clean up the timeout if the component unmounts or if isOpen changes before timeout completes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isOpen, view])

  // Scroll to current year when years view is opened
  React.useEffect(() => {
    if (view === 'years' && currentYearRef.current) {
      setTimeout(() => {
        currentYearRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
      }, 100)
    }
  }, [view])

  // Handle date selection
  const handleSelect = (date: Date) => {
    setSelectedDate(date)
    setCurrentMonth(date)
    if (onDateChange) {
      onDateChange(date)
    }
    setIsOpen(false)
  }

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Toggle between days and years view
  const toggleView = () => {
    setView(view === 'days' ? 'years' : 'days')
  }

  // Handle month selection
  const handleMonthSelect = (year: number, monthIndex: number) => {
    const newDate = setMonth(setYear(currentMonth, year), monthIndex)
    setCurrentMonth(newDate)
    setView('days')
  }

  // Generate years from 1950 to 2050
  const years = React.useMemo(() => {
    return Array.from({ length: 2050 - 1950 + 1 }, (_, i) => 1950 + i)
  }, [])

  // Generate months with short names
  const months = [
    { name: 'Jan', full: 'January' },
    { name: 'Feb', full: 'February' },
    { name: 'Mar', full: 'March' },
    { name: 'Apr', full: 'April' },
    { name: 'May', full: 'May' },
    { name: 'Jun', full: 'June' },
    { name: 'Jul', full: 'July' },
    { name: 'Aug', full: 'August' },
    { name: 'Sep', full: 'September' },
    { name: 'Oct', full: 'October' },
    { name: 'Nov', full: 'November' },
    { name: 'Dec', full: 'December' }
  ]

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const startDay = getDay(startOfMonth(currentMonth))
    const days = []

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      days.push(date)
    }

    return days
  }, [currentMonth])

  // Day names
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        className={cn('w-[180px] justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}
        asChild
      >
        <PopoverTrigger>
          <span className='flex-1'>{selectedDate ? format(selectedDate, 'PPP') : placeholder}</span>
          <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </PopoverTrigger>
      </Button>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between pb-1">
            <Button
              variant="ghost"
              className="text-sm font-medium flex items-center data-[state=open]:text-muted-foreground/80 [&[data-state=open]>svg]:rotate-180"
              onClick={toggleView}
              data-state={view === 'years' ? 'open' : 'closed'}
            >
              {format(currentMonth, 'MMMM yyyy')}
              <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              className={cn(
                'transition-opacity duration-200',
                view === 'years' ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}
            >
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {dayNames.map((day) => (
                  <div key={day} className="py-1 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <div key={i}>
                    {day ? (
                      <Button
                        variant="ghost"
                        className={cn(
                          'h-8 w-8 p-0 font-normal',
                          isToday(day) && 'bg-accent text-accent-foreground',
                          selectedDate &&
                              isSameDay(day, selectedDate) &&
                              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                        )}
                        onClick={() => handleSelect(day)}
                      >
                        {day.getDate()}
                      </Button>
                    ) : (
                      <div className="h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-200 bg-popover',
                view === 'years' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              <ScrollArea className="h-full pl-2 pr-4">
                <Accordion type="single" collapsible defaultValue={currentYearValue} className="w-full">
                  {years.map((year) => (
                    <div key={year} ref={year === currentYear ? currentYearRef : undefined}>
                      <AccordionItem value={`year-${year}`}>
                        <AccordionTrigger className="text-sm py-2 [&>svg]:last:hidden hover:no-underline border-t rounded-none text-foreground/70 hover:text-foreground">
                          <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
                          <span className='flex-1'>{year}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-4 gap-2">
                            {months.map((month, index) => (
                              <Button
                                key={month.name}
                                variant={index === currentMonthIndex && year === currentYear ? 'default' : 'outline'}
                                size='sm'
                                className="text-sm"
                                title={month.full}
                                onClick={() => handleMonthSelect(year, index)}
                              >
                                {month.name}
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </div>
          {selectedDate && (
            <Button
              className='w-full'
              variant='ghost'
              onClick={() => {
                setSelectedDate(undefined)
                setIsOpen(false)
                onReset?.()
              }}
            >
              Clear date
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
