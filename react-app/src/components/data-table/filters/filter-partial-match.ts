import { FilterParams } from '@/components/data-table/data-table-types'

export const partialMatchFilter = <TData> ({
  row,
  columnId,
  filterValue
}: FilterParams<TData, string>) => {
  const rowValue = row.getValue(columnId)
  return String(rowValue)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase())
}
