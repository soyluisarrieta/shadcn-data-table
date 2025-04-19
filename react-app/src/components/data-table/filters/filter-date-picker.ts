import { FilterParams } from '@/components/data-table/data-table-types'
import { format } from 'date-fns'

type TFilterValue = Date | { from: Date, to: Date; }
type TParams<TData> = FilterParams<TData, TFilterValue>

export const datePickerFilter = <TData>({
  row,
  columnId,
  filterValue
}: TParams<TData>): boolean => {
  const rawValue: Date = row.getValue(columnId)
  if (!rawValue) return false

  const dateFormat = (date: Date) => format(date, 'yyyy-MM-dd')
  const dateStr = typeof rawValue === 'string' ? rawValue : dateFormat(rawValue)

  if (filterValue instanceof Date) {
    return dateStr === dateFormat(filterValue)
  }

  const { from: fromDate, to: toDate } = filterValue

  if (dateStr === dateFormat(fromDate)) return true
  if (dateStr === dateFormat(toDate)) return true

  const cellDate = new Date(dateStr)
  return cellDate >= fromDate && cellDate <= toDate
}
