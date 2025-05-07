import type { FilterKeys } from '@/components/data-table/data-table-types'
import { datePickerFilter } from '@/components/data-table/filters/filter-date-picker'
import { globalSearchFilter } from '@/components/data-table/filters/filter-global-search'
import { partialMatchFilter } from '@/components/data-table/filters/filter-partial-match'
import { selectionFilter } from '@/components/data-table/filters/filter-selection'

// Filter raw functions
export const FILTER_FUNCTIONS = {
  GLOBAL_SEARCH: globalSearchFilter,
  PARTIAL_MATCH: partialMatchFilter,
  SINGLE_SELECTION: selectionFilter,
  MULTI_SELECTION: selectionFilter,
  DATE_PICKER: datePickerFilter
} as const

// Generate enum
export const FILTERS = Object.freeze(
  Object.fromEntries(
    (Object.keys(FILTER_FUNCTIONS)).map(k => [k, k])
  ) as Record<FilterKeys, FilterKeys>
)
