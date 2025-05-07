import type { FilterParams } from '@/components/data-table/data-table-types'

export const selectionFilter = <TData>({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string[]>) => {
  if (!filterValue || filterValue.length === 0) return true
  return filterValue.includes(row.getValue(columnId))
}
