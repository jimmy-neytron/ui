import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type {
  UiDataTableColumn,
  UiDataTableFilterValues,
  UiDataTableNumberRange,
  UiDataTableSort,
} from './UiDataTable.types';

export interface UseDataTableOptions<TRow extends object> {
  rows: MaybeRefOrGetter<readonly TRow[]>;
  columns: MaybeRefOrGetter<readonly UiDataTableColumn<TRow>[]>;
  sort: MaybeRefOrGetter<UiDataTableSort | null>;
  filters: MaybeRefOrGetter<UiDataTableFilterValues>;
  page: MaybeRefOrGetter<number>;
  pageSize: MaybeRefOrGetter<number>;
  manualSorting?: MaybeRefOrGetter<boolean>;
  manualFiltering?: MaybeRefOrGetter<boolean>;
  manualPagination?: MaybeRefOrGetter<boolean>;
}

const dataTableCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

export function getDataTableCellValue<TRow extends object>(
  row: TRow,
  column: UiDataTableColumn<TRow>,
) {
  if (typeof column.accessor === 'function') return column.accessor(row);
  const key = column.accessor ?? column.key;
  return (row as Record<PropertyKey, unknown>)[key as PropertyKey];
}

export function isDataTableFilterActive(value: unknown) {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.values(value).some((item) => item !== null && item !== undefined && item !== '');
  }
  return true;
}

function compareValues(left: unknown, right: unknown) {
  if (left === right) return 0;
  if (left === null || left === undefined) return 1;
  if (right === null || right === undefined) return -1;
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime();
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return dataTableCollator.compare(String(left), String(right));
}

function matchesFilter<TRow extends object>(
  row: TRow,
  column: UiDataTableColumn<TRow>,
  filterValue: unknown,
) {
  if (!column.filter || !isDataTableFilterActive(filterValue)) return true;
  const cellValue = getDataTableCellValue(row, column);
  if (column.filter.predicate) return column.filter.predicate(cellValue, filterValue, row);

  if (column.filter.type === 'text') {
    const source = String(cellValue ?? '');
    const query = String(filterValue);
    return column.filter.caseSensitive
      ? source.includes(query)
      : source.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  }

  if (column.filter.type === 'select') {
    return Array.isArray(filterValue)
      ? filterValue.includes(cellValue)
      : cellValue === filterValue;
  }

  if (column.filter.type === 'number-range') {
    const numericValue = Number(cellValue);
    const range = filterValue as UiDataTableNumberRange;
    if (Number.isNaN(numericValue)) return false;
    if (range.min !== undefined && numericValue < range.min) return false;
    if (range.max !== undefined && numericValue > range.max) return false;
  }

  return true;
}

export function filterDataTableRows<TRow extends object>(
  rows: readonly TRow[],
  columns: readonly UiDataTableColumn<TRow>[],
  filters: UiDataTableFilterValues,
) {
  const filterableColumns = columns.filter((column) =>
    column.filter && isDataTableFilterActive(filters[column.key]));
  if (!filterableColumns.length) return [...rows];
  return rows.filter((row) =>
    filterableColumns.every((column) => matchesFilter(row, column, filters[column.key])));
}

export function sortDataTableRows<TRow extends object>(
  rows: readonly TRow[],
  columns: readonly UiDataTableColumn<TRow>[],
  sort: UiDataTableSort | null,
) {
  if (!sort) return [...rows];
  const column = columns.find((item) => item.key === sort.key);
  if (!column?.sortable) return [...rows];
  const direction = sort.direction === 'asc' ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const result = column.comparator
        ? column.comparator(left.row, right.row)
        : compareValues(
            getDataTableCellValue(left.row, column),
            getDataTableCellValue(right.row, column),
          );
      return result === 0 ? left.index - right.index : result * direction;
    })
    .map(({ row }) => row);
}

export function useDataTable<TRow extends object>(options: UseDataTableOptions<TRow>) {
  const filteredRows = computed(() => {
    const rows = toValue(options.rows);
    return toValue(options.manualFiltering ?? false)
      ? [...rows]
      : filterDataTableRows(rows, toValue(options.columns), toValue(options.filters));
  });
  const sortedRows = computed(() =>
    toValue(options.manualSorting ?? false)
      ? filteredRows.value
      : sortDataTableRows(filteredRows.value, toValue(options.columns), toValue(options.sort)));
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(sortedRows.value.length / Math.max(1, toValue(options.pageSize)))));
  const currentPage = computed(() =>
    Math.min(pageCount.value, Math.max(1, toValue(options.page))));
  const displayedRows = computed(() => {
    if (toValue(options.manualPagination ?? false)) return sortedRows.value;
    const start = (currentPage.value - 1) * Math.max(1, toValue(options.pageSize));
    return sortedRows.value.slice(start, start + Math.max(1, toValue(options.pageSize)));
  });

  return {
    filteredRows,
    sortedRows,
    displayedRows,
    pageCount,
    currentPage,
  };
}
