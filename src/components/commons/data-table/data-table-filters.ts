export enum FilterType {
  MultiSelection = 'multiple-selection',
  SingleSelection = 'single-selection',
  SingleDate = 'single-date',
}

interface Row<TData> {
  getValue(columnId: string): TData;
}

interface FilterParams<TData> {
  row: Row<TData>;
  columnId: string;
  filterValue: string | string[];
}

type FilterFunction<TData> = (params: FilterParams<TData>) => boolean;

const createFilter = <TData>(filterFn: FilterFunction<TData>) => {
  return (row: Row<TData>, columnId: string, filterValue: string | string[]) => {
    return filterFn({ row, columnId, filterValue })
  }
}

const multiSelectionFilterFn = <TData>({ row, columnId, filterValue }: FilterParams<TData>) => {
  if (!filterValue || (filterValue as string[]).length === 0) return true
  return (filterValue as string[]).includes(row.getValue(columnId) as unknown as string)
}

const singleSelectionFilterFn = <TData>({ row, columnId, filterValue }: FilterParams<TData>) => {
  return row.getValue(columnId) === filterValue
}

const singleDateFilterFn = <TData>({ row, columnId, filterValue }: FilterParams<TData>) => {
  const rowDate = new Date(row.getValue(columnId) as unknown as string).toISOString().split('T')[0]
  return rowDate === filterValue
}

export const FILTERS = {
  [FilterType.MultiSelection]: createFilter(multiSelectionFilterFn),
  [FilterType.SingleSelection]: createFilter(singleSelectionFilterFn),
  [FilterType.SingleDate]: createFilter(singleDateFilterFn)
}
