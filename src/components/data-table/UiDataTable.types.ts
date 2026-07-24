import type { UiSelectOption, UiSelectValue } from '../select';

export type UiDataTableAlign = 'start' | 'center' | 'end';
export type UiDataTableSticky = 'start' | 'end';
export type UiDataTableLayout = 'auto' | 'fixed';
export type UiDataTableSortDirection = 'asc' | 'desc';
export type UiDataTableFilterValue = unknown;
export type UiDataTableFilterValues = Record<string, UiDataTableFilterValue>;

export interface UiDataTableSort {
  key: string;
  direction: UiDataTableSortDirection;
}

export interface UiDataTableNumberRange {
  min?: number;
  max?: number;
}

interface UiDataTableFilterBase<TRow extends object> {
  label?: string;
  predicate?: (cellValue: unknown, filterValue: unknown, row: TRow) => boolean;
}

export interface UiDataTableTextFilter<TRow extends object> extends UiDataTableFilterBase<TRow> {
  type: 'text';
  placeholder?: string;
  caseSensitive?: boolean;
}

export interface UiDataTableSelectFilter<TRow extends object> extends UiDataTableFilterBase<TRow> {
  type: 'select';
  options: readonly UiSelectOption<UiSelectValue>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
}

export interface UiDataTableNumberRangeFilter<TRow extends object> extends UiDataTableFilterBase<TRow> {
  type: 'number-range';
  min?: number;
  max?: number;
  step?: number;
}

export interface UiDataTableCustomFilter<TRow extends object> extends UiDataTableFilterBase<TRow> {
  type: 'custom';
}

export type UiDataTableFilter<TRow extends object> =
  | UiDataTableTextFilter<TRow>
  | UiDataTableSelectFilter<TRow>
  | UiDataTableNumberRangeFilter<TRow>
  | UiDataTableCustomFilter<TRow>;

export interface UiDataTableColumn<TRow extends object> {
  key: string;
  label: string;
  accessor?: keyof TRow | ((row: TRow) => unknown);
  sortable?: boolean;
  comparator?: (left: TRow, right: TRow) => number;
  filter?: UiDataTableFilter<TRow>;
  align?: UiDataTableAlign;
  width?: string | number;
  minWidth?: string | number;
  sticky?: UiDataTableSticky;
  stickyOffset?: string | number;
  truncate?: boolean;
  headerClass?: string;
  cellClass?: string;
  format?: (value: unknown, row: TRow) => string | number;
}

export interface UiDataTableLabels {
  filters: string;
  filtersActive: string;
  filterDialogTitle: string;
  filterDialogDescription: string;
  applyFilters: string;
  resetFilters: string;
  clearSort: string;
  empty: string;
  loading: string;
  results: string;
  sortAscending: string;
  sortDescending: string;
  clearSorting: string;
  minimum: string;
  maximum: string;
  loadingMore: string;
  loadMore: string;
}

export type UiDataTableRowKey<TRow extends object> =
  | keyof TRow
  | ((row: TRow, index: number) => string | number);

export type UiDataTableRowClass<TRow extends object> =
  | string
  | ((row: TRow, index: number) => string | undefined);

export interface UiDataTableLoadMoreContext {
  offset: number;
  sort: UiDataTableSort | null;
  filters: Readonly<UiDataTableFilterValues>;
}

export interface UiDataTableProps<TRow extends object = Record<string, unknown>> {
  rows: readonly TRow[];
  columns: readonly UiDataTableColumn<TRow>[];
  rowKey?: UiDataTableRowKey<TRow>;
  sort?: UiDataTableSort | null;
  filters?: UiDataTableFilterValues;
  page?: number;
  pageSize?: number;
  total?: number;
  pagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  dense?: boolean;
  bordered?: boolean;
  maxHeight?: string | number;
  tableMinWidth?: string | number;
  tableLayout?: UiDataTableLayout;
  rowClass?: UiDataTableRowClass<TRow>;
  caption?: string;
  ariaLabel?: string;
  filterable?: boolean;
  filterDialogTeleport?: boolean;
  lazy?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  lazyThreshold?: number;
  labels?: Partial<UiDataTableLabels>;
}

export interface UiDataTableFiltersProps<TRow extends object = Record<string, unknown>> {
  modelValue?: boolean;
  columns: readonly UiDataTableColumn<TRow>[];
  filters?: UiDataTableFilterValues;
  labels?: Partial<UiDataTableLabels>;
  teleport?: boolean;
}

export interface UiDataTableFilterSlotProps<TRow extends object> {
  column: UiDataTableColumn<TRow>;
  value: unknown;
  setValue: (value: unknown) => void;
  filters: Readonly<UiDataTableFilterValues>;
}

export interface UiDataTableCellSlotProps<TRow extends object> {
  row: TRow;
  column: UiDataTableColumn<TRow>;
  value: unknown;
  rowIndex: number;
}

export interface UiDataTableHeaderSlotProps<TRow extends object> {
  column: UiDataTableColumn<TRow>;
  sort: UiDataTableSort | null;
  toggleSort: () => void;
}
