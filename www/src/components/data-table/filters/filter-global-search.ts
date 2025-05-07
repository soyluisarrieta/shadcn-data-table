import type { CustomColumnDef, FilterParams } from '@/components/data-table/data-table-types'

type TParams<TData> = FilterParams<TData, {
  searchBy: string;
  searchValue: string;
}>

export const globalSearchFilter = <TData>({
  row,
  filterValue
}: TParams<TData>) => {
  if (!filterValue || !filterValue.searchValue) return true

  const searchValueLower = filterValue.searchValue.toLowerCase()

  if (filterValue.searchBy === 'all') {
    return row.getAllCells().some((cell) => {
      const columnDef = cell.column.columnDef as CustomColumnDef<TData>
      if (!columnDef?.searchable) return false

      const cellValue = cell.getValue()
      return String(cellValue).toLowerCase().includes(searchValueLower)
    })
  }

  const cell = row.getAllCells().find((cell) => cell.column.id === filterValue.searchBy)
  if (!cell) return true
  return String(cell.getValue()).toLowerCase().includes(searchValueLower)
}
