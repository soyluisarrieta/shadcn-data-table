import type { Row } from '@tanstack/react-table'
import type { FilterParams } from '@/components/data-table/data-table-types'

/**
 * Creates a filter function for data table rows
 * @param filter Custom filter function that evaluates filtering conditions
 * @returns Function that applies the filter to a specific row and column
 */
export const createFilter = <TData, TValue>(
  filter: (params: FilterParams<TData, TValue>) => boolean
): (row: Row<TData>, columnId: string, filterValue: TValue) => boolean => {
  return (row: Row<TData>, columnId: string, filterValue: TValue) => {
    return filter({ row, columnId, filterValue })
  }
}
