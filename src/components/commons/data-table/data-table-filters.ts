import { FilterableOption } from '@/components/commons/data-table/data-table'

export enum FilterType {
  MultiSelection = 'multiple-selection',
  SingleSelection = 'single-selection',
  DatePicker = 'date',
}

interface Row<TData> {
  getValue(columnId: string): TData;
}

interface FilterParams<TValue> {
  row: Row<FilterableOption['value']>;
  columnId: string;
  filterValue: TValue;
}

type FilterFunction<TValue> = (params: FilterParams<TValue>) => boolean;

const createFilter = <TValue>(filterFn: FilterFunction<TValue>) => {
  return (row: Row<string>, columnId: string, filterValue: TValue) => {
    return filterFn({ row, columnId, filterValue })
  }
}

const multiSelectionFilterFn = ({ row, columnId, filterValue }: FilterParams<string[]>) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(row.getValue(columnId))
}

const singleSelectionFilterFn = ({ row, columnId, filterValue }: FilterParams<string>) => {
  return row.getValue(columnId) === filterValue
}

const formatDate = (date: Date) => date?.toISOString().split('T')[0]
const datePickerFilterFn = ({ row, columnId, filterValue }: FilterParams<Date | { from: Date, to: Date }>) => {
  const date = row.getValue(columnId)
  if (filterValue instanceof Date) {
    return date === formatDate(filterValue)
  }

  const fromDate = filterValue.from
  const toDate = filterValue.to

  if (formatDate(fromDate) === date) return true
  if (formatDate(toDate) === date) return true

  return new Date(date) >= fromDate && new Date(date) <= toDate
}

export const FILTERS = {
  [FilterType.MultiSelection]: createFilter(multiSelectionFilterFn),
  [FilterType.SingleSelection]: createFilter(singleSelectionFilterFn),
  [FilterType.DatePicker]: createFilter(datePickerFilterFn)
}
