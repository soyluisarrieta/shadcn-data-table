import type { Row } from '@tanstack/react-table'
import type { FilterParams } from '@/components/data-table/data-table-types'
import { FILTER_FUNCTIONS } from '@/components/data-table/filters'

/**
 * Utility type for filter functions that take named parameters
 */
type FilterFunction<TData, TValue> = (params: FilterParams<TData, TValue>) => boolean;

export const createFilterFn = <TData, TValue>(filterFn: FilterFunction<TData, TValue>) => {
  return (row: Row<TData>, columnId: string, filterValue: TValue) => (
    filterFn({ row, columnId, filterValue })
  )}

/**
 * Retrieves a filter function based on the provided filter type
 * @template TData - The type of data in the table row
 * @template T - The specific filter type extending FilterType
 * @param type - The type identifier for the desired filter function
 * @returns A type-safe filter function that can be applied to table rows
 * @throws {Error} When the specified filter type is not found in FILTER_FUNCTIONS
 */
type FilterType = keyof typeof FILTER_FUNCTIONS
type FilterValue<T extends FilterType> = Parameters<typeof FILTER_FUNCTIONS[T]>[0]['filterValue']

export const getFilterFn = <TData, T extends FilterType>(type: T) => {
  const fn = FILTER_FUNCTIONS[type] as FilterFunction<TData, FilterValue<T>>
  if (!fn) throw new Error(`Filter type \`${type}\` not found`)
  return createFilterFn(fn)
}
