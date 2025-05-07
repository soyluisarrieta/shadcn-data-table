import type { FILTER_FUNCTIONS } from '@/components/data-table/filters'
import type { Row, ColumnDef } from '@tanstack/react-table'

type OnClickActionBase<TData, TReturn = void> = (rows: TData[], cleanRowSelection: () => void) => TReturn

export type FilterFunction<TData,TValue = any> = (row: Row<TData>, columnId: string, filterValue: TValue) => boolean;

export interface FilterParams<TData, TValue> {
  row: Row<TData>;
  columnId: string;
  filterValue: TValue;
}

export type CustomColumnDef<TData> = ColumnDef<TData> & {
  accessorKey?: keyof TData;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  minWidth?: string | number;
  label?: string;
  searchable?: boolean;
}

export type DataTableTab<TData> = {
  value: string;
  label: string;
  columnVisibility?: Record<string, boolean>;
  filter?: (data: TData) => boolean;
}

export type FilterableOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type FilterKeys = keyof typeof FILTER_FUNCTIONS;

export interface FilterColumn<TData> {
  columnKey: Extract<keyof TData, string>;
  label: string;
  type: `${FilterKeys}`;
  options?: FilterableOption[]
  filterFn?: (params: FilterParams<TData, string[] | number[] | null>) => boolean;
}

export interface FilterColumnExtended<TData> extends FilterColumn<TData> {
  readonly id: string
}

export type SelectionActionProps<TData> = {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: OnClickActionBase<TData>;
}

export type ExportFormat = 'pdf' | 'csv' | 'json' | 'xlsx'

export interface DataTableActions<TData> {
  onExport?: (rows: TData[], format: ExportFormat) => void
  onRemoveRows?: OnClickActionBase<TData>
  customActions?: Array<SelectionActionProps<TData> | { component: OnClickActionBase<TData, React.JSX.Element> }>
  disableExport?: boolean
  disableCopy?: boolean
}

export interface DataTableTabsConfig<TData> {
  tabs: DataTableTab<TData>[];
  defaultTab?: string;
  className?: string;
}
