import { FILTER_FUNCTIONS } from '@/components/data-table/filters'
import type { Row, ColumnDef } from '@tanstack/react-table'

type OnClickActionBase<TData, TReturn = void> = (rows: TData[], cleanRowSelection: () => void) => TReturn

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

export interface FilterableColumn<TData> {
  columnKey: keyof TData;
  label: string;
  type: `${FilterKeys}`;
  options?: FilterableOption[]
  filterFn?: (params: FilterParams<TData, string[] | number[] | null>) => boolean;
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
