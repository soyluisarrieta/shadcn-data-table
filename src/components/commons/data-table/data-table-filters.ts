import { Row } from '@tanstack/react-table'

export enum FilterType {
  MultiSelection = 'multiple-selection',
  SingleSelection = 'single-selection',
  DatePicker = 'date',
}

export interface FilterParams<TData, TValue> {
  row: Row<TData>;
  columnId: string;
  filterValue: TValue;
}

export type FilterFunction<TData, TValue> = (params: FilterParams<TData, TValue>) => boolean;

const createFilter = <TData, TValue>(filterFn: FilterFunction<TData, TValue>) => {
  return (row: Row<TData>, columnId: string, filterValue: TValue) => {
    return filterFn({ row, columnId, filterValue })
  }
}

const globalFilterFn = <TData>({
  row,
  filterValue
}: FilterParams<TData, {
  searchBy: string;
  searchValue: string;
}>) => {
  if (!filterValue || !filterValue.searchValue) return true

  const searchValueLower = filterValue.searchValue.toLowerCase()

  if (filterValue.searchBy === 'all') {
    return row.getAllCells().some((cell: any) => {
      const cellValue = cell.getValue()
      return String(cellValue).toLowerCase().includes(searchValueLower)
    })
  }

  const cell = row.getAllCells().find((cell: any) => cell.column.id === filterValue.searchBy)
  if (!cell) return true
  return String(cell.getValue()).toLowerCase().includes(searchValueLower)
}

const partialMatchFilterFn = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string>) => {
  const rowValue = row.getValue(columnId)
  return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

const selectionFilterFn = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string[]>) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(row.getValue(columnId))
}

const formatDate = (date: Date) => date.toISOString().split('T')[0]
const datePickerFilterFn = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, Date | {
  from: Date;
  to: Date;
}>) => {
  const rawValue = row.getValue(columnId)
  if (!rawValue) return false

  const dateStr = typeof rawValue === 'string' ? rawValue : formatDate(rawValue as Date)

  if (filterValue instanceof Date) {
    return dateStr === formatDate(filterValue)
  }

  const { from: fromDate, to: toDate } = filterValue

  if (dateStr === formatDate(fromDate)) return true
  if (dateStr === formatDate(toDate)) return true

  const cellDate = new Date(dateStr)
  return cellDate >= fromDate && cellDate <= toDate
}

export const FILTERS = {
  partialMatch: createFilter(partialMatchFilterFn),
  globalSearch: createFilter(globalFilterFn),
  [FilterType.MultiSelection]: createFilter(selectionFilterFn),
  [FilterType.SingleSelection]: createFilter(selectionFilterFn),
  [FilterType.DatePicker]: createFilter(datePickerFilterFn)
}
