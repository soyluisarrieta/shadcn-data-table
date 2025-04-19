import type { FilterParams } from '@/components/data-table/data-table-types'

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

  // 🚩 CONFIGURAR ALGUNA PROPIEDAD PARA IMPEDIR QUE SE HAGA BÚSQUEDA DE COLUMNAS ESPECIFICAS.

  if (filterValue.searchBy === 'all') {
    return row.getAllCells().some((cell) => {
      const cellValue = cell.getValue()
      return String(cellValue).toLowerCase().includes(searchValueLower)
    })
  }

  const cell = row.getAllCells().find((cell) => cell.column.id === filterValue.searchBy)
  if (!cell) return true
  return String(cell.getValue()).toLowerCase().includes(searchValueLower)
}
