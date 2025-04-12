import type { FilterParams } from '@/components/data-table/data-table-types'
import { createFilter } from '@/components/data-table/data-table-utils'
import { FilterType } from '@/components/data-table/filters'
import { format } from 'date-fns'

const globalFilter = <TData>({
  row,
  filterValue
}: FilterParams<TData, {
  searchBy: string;
  searchValue: string;
}>) => {
  if (!filterValue || !filterValue.searchValue) return true

  const searchValueLower = filterValue.searchValue.toLowerCase()

  if (filterValue.searchBy === 'all') {
    return row.getAllCells().some((cell) => {
      if (cell.column.columnDef.filterFn === FILTERS[FilterType.DatePicker]) {
        return false
      }
      const cellValue = cell.getValue()
      return String(cellValue).toLowerCase().includes(searchValueLower)
    })
  }

  const cell = row.getAllCells().find((cell) => cell.column.id === filterValue.searchBy)
  if (!cell) return true
  return String(cell.getValue()).toLowerCase().includes(searchValueLower)
}

const partialMatchFilter = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string>) => {
  const rowValue = row.getValue(columnId)
  return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

const selectionFilter = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string[]>) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(row.getValue(columnId))
}

const datePickerFilter = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, Date | {
  from: Date;
  to: Date;
}>) => {
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

export const FILTERS = {
  partialMatch: createFilter(partialMatchFilter),
  globalSearch: createFilter(globalFilter),
  [FilterType.MultiSelection]: createFilter(selectionFilter),
  [FilterType.SingleSelection]: createFilter(selectionFilter),
  [FilterType.DatePicker]: createFilter(datePickerFilter)
}
