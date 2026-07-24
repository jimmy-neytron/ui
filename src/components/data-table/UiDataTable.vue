<script
  setup
  lang="ts"
  generic="TRow extends object = Record<string, unknown>"
>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue';
import UiButton from '../button/UiButton.vue';
import UiPagination from '../pagination/UiPagination.vue';
import { defaultUiDataTableLabels } from './dataTableLabels';
import UiDataTableFilters from './UiDataTableFilters.vue';
import {
  getDataTableCellValue,
  isDataTableFilterActive,
  useDataTable,
} from './useDataTable';
import type {
  UiDataTableColumn,
  UiDataTableFilterValues,
  UiDataTableLoadMoreContext,
  UiDataTableProps,
  UiDataTableSort,
} from './UiDataTable.types';

defineOptions({ name: 'UiDataTable' });

const props = withDefaults(defineProps<UiDataTableProps<TRow>>(), {
  sort: null,
  filters: () => ({}),
  page: 1,
  pageSize: 10,
  pagination: true,
  manualSorting: false,
  manualFiltering: false,
  manualPagination: false,
  loading: false,
  striped: false,
  hoverable: true,
  stickyHeader: false,
  dense: false,
  bordered: false,
  tableLayout: 'auto',
  filterable: true,
  filterDialogTeleport: true,
  lazy: false,
  hasMore: true,
  loadingMore: false,
  lazyThreshold: 96,
});
const emit = defineEmits<{
  'update:sort': [value: UiDataTableSort | null];
  'update:filters': [value: UiDataTableFilterValues];
  'update:page': [value: number];
  'sort-change': [value: UiDataTableSort | null];
  'filters-change': [value: UiDataTableFilterValues];
  'page-change': [value: number];
  'row-click': [row: TRow, index: number, event: MouseEvent];
  'row-dblclick': [row: TRow, index: number, event: MouseEvent];
  'load-more': [context: UiDataTableLoadMoreContext];
}>();

const labels = computed(() => ({ ...defaultUiDataTableLabels, ...props.labels }));
const resolvedSort = computed(() => props.sort ?? null);
const resolvedFilters = computed(() => props.filters ?? {});
const resolvedPage = computed(() => props.page ?? 1);
const resolvedPageSize = computed(() => Math.max(1, props.pageSize ?? 10));
const filterColumns = computed(() => props.columns.filter((column) => column.filter));
const activeFilterCount = computed(() =>
  Object.values(resolvedFilters.value).filter(isDataTableFilterActive).length);
const filtersOpen = ref(false);
const scrollRef = ref<HTMLElement | null>(null);
const lastLazyOffset = ref(-1);

const {
  filteredRows,
  displayedRows,
  currentPage,
} = useDataTable({
  rows: () => props.rows,
  columns: () => props.columns,
  sort: resolvedSort,
  filters: resolvedFilters,
  page: resolvedPage,
  pageSize: resolvedPageSize,
  manualSorting: () => props.manualSorting ?? false,
  manualFiltering: () => props.manualFiltering ?? false,
  manualPagination: () => props.manualPagination || props.lazy,
});

const totalRows = computed(() =>
  props.total ?? (props.manualFiltering || props.manualPagination || props.lazy
    ? props.rows.length
    : filteredRows.value.length));
const showPagination = computed(() =>
  !props.lazy && props.pagination && totalRows.value > resolvedPageSize.value);
const tableStyle = computed<CSSProperties | undefined>(() => {
  if (props.maxHeight === undefined) return undefined;
  return {
    '--cui-data-table-max-height': typeof props.maxHeight === 'number'
      ? `${props.maxHeight}px`
      : props.maxHeight,
  };
});
const resolvedTableStyle = computed<CSSProperties>(() => ({
  minWidth: cssSize(props.tableMinWidth),
  tableLayout: props.tableLayout,
}));

function cssSize(value: string | number | undefined) {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function columnStyle(column: UiDataTableColumn<TRow>): CSSProperties {
  const style: CSSProperties & Record<string, string | undefined> = {
    width: cssSize(column.width),
    minWidth: cssSize(column.minWidth),
    textAlign: column.align,
  };
  if (column.sticky === 'start') {
    style['--cui-data-table-sticky-start'] = cssSize(column.stickyOffset) ?? '0px';
  }
  if (column.sticky === 'end') {
    style['--cui-data-table-sticky-end'] = cssSize(column.stickyOffset) ?? '0px';
  }
  return style;
}

function rowKey(row: TRow, index: number) {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  if (props.rowKey !== undefined) {
    const value = (row as Record<PropertyKey, unknown>)[props.rowKey as PropertyKey];
    if (typeof value === 'string' || typeof value === 'number') return value;
  }
  return index;
}

function displayValue(row: TRow, column: UiDataTableColumn<TRow>) {
  const value = getDataTableCellValue(row, column);
  return column.format ? column.format(value, row) : value ?? '';
}

function resolvedRowClass(row: TRow, index: number) {
  return typeof props.rowClass === 'function' ? props.rowClass(row, index) : props.rowClass;
}

function nextSort(column: UiDataTableColumn<TRow>) {
  if (!column.sortable) return;
  let value: UiDataTableSort | null;
  if (resolvedSort.value?.key !== column.key) {
    value = { key: column.key, direction: 'asc' };
  } else if (resolvedSort.value.direction === 'asc') {
    value = { key: column.key, direction: 'desc' };
  } else {
    value = null;
  }
  emit('update:sort', value);
  emit('sort-change', value);
  emitPage(1);
}

function sortLabel(column: UiDataTableColumn<TRow>) {
  if (resolvedSort.value?.key !== column.key) return labels.value.sortAscending;
  return resolvedSort.value.direction === 'asc'
    ? labels.value.sortDescending
    : labels.value.clearSorting;
}

function applyFilters(filters: UiDataTableFilterValues) {
  emit('update:filters', filters);
  emit('filters-change', filters);
  emitPage(1);
}

function emitPage(page: number) {
  if (page === resolvedPage.value) return;
  emit('update:page', page);
  emit('page-change', page);
}

function requestLazyLoad(force = false) {
  if (!props.lazy || !props.hasMore || props.loading || props.loadingMore) return;
  const element = scrollRef.value;
  if (!force && element) {
    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (remaining > props.lazyThreshold) return;
  }
  if (!force && lastLazyOffset.value === props.rows.length) return;
  lastLazyOffset.value = props.rows.length;
  emit('load-more', {
    offset: props.rows.length,
    sort: resolvedSort.value,
    filters: resolvedFilters.value,
  });
}

watch(
  [() => props.rows.length, resolvedSort, resolvedFilters, () => props.hasMore],
  async () => {
    lastLazyOffset.value = -1;
    await nextTick();
    requestLazyLoad();
  },
  { deep: true },
);

onMounted(async () => {
  await nextTick();
  requestLazyLoad();
});

defineExpose({
  checkLazyLoad: () => requestLazyLoad(true),
});
</script>

<template>
  <section
    class="cui-data-table"
    :data-striped="striped || undefined"
    :data-hoverable="hoverable"
    :data-sticky-header="stickyHeader || undefined"
    :data-dense="dense || undefined"
    :data-bordered="bordered || undefined"
    :data-lazy="lazy || undefined"
    :aria-busy="loading || undefined"
  >
    <div v-if="$slots.toolbar || filterable && filterColumns.length" class="cui-data-table__toolbar">
      <div class="cui-data-table__toolbar-content">
        <slot
          name="toolbar"
          :rows="displayedRows"
          :total="totalRows"
          :filters="resolvedFilters"
          :sort="resolvedSort"
        />
      </div>
      <UiButton
        v-if="filterable && filterColumns.length"
        variant="secondary"
        size="sm"
        :aria-label="labels.filters"
        @click="filtersOpen = true"
      >
        <span>{{ labels.filters }}</span>
        <span v-if="activeFilterCount" class="cui-data-table__filter-count">
          {{ activeFilterCount }}
          <span class="cui-sr-only">{{ labels.filtersActive }}</span>
        </span>
      </UiButton>
    </div>

    <div
      ref="scrollRef"
      class="cui-data-table__scroll"
      :style="tableStyle"
      :aria-label="ariaLabel ?? caption"
      tabindex="0"
      @scroll.passive="requestLazyLoad()"
    >
      <table :aria-label="ariaLabel" :style="resolvedTableStyle">
        <caption v-if="caption">{{ caption }}</caption>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="column.headerClass"
              :style="columnStyle(column)"
              :data-align="column.align ?? 'start'"
              :data-sticky="column.sticky"
              :data-truncate="column.truncate || undefined"
              :aria-sort="resolvedSort?.key === column.key
                ? (resolvedSort.direction === 'asc' ? 'ascending' : 'descending')
                : undefined"
            >
              <slot
                :name="`header-${column.key}`"
                :column="column"
                :sort="resolvedSort"
                :toggle-sort="() => nextSort(column)"
              >
                <button
                  v-if="column.sortable"
                  type="button"
                  class="cui-data-table__sort"
                  :data-active="resolvedSort?.key === column.key || undefined"
                  :aria-label="`${column.label}: ${sortLabel(column)}`"
                  @click="nextSort(column)"
                >
                  <span>{{ column.label }}</span>
                  <span class="cui-data-table__sort-icon" aria-hidden="true">
                    <template v-if="resolvedSort?.key === column.key">
                      {{ resolvedSort.direction === 'asc' ? '↑' : '↓' }}
                    </template>
                    <template v-else>↕</template>
                  </span>
                </button>
                <span v-else>{{ column.label }}</span>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="Math.max(1, columns.length)" class="cui-data-table__state">
              <slot name="loading">
                <span class="cui-data-table__loading">
                  <span class="cui-spinner" aria-hidden="true" />
                  {{ labels.loading }}
                </span>
              </slot>
            </td>
          </tr>
          <tr v-else-if="!displayedRows.length && !(lazy && hasMore)">
            <td :colspan="Math.max(1, columns.length)" class="cui-data-table__state">
              <slot name="empty" :filters="resolvedFilters">
                {{ labels.empty }}
              </slot>
            </td>
          </tr>
          <tr
            v-for="(row, rowIndex) in loading ? [] : displayedRows"
            v-else
            :key="rowKey(row, rowIndex)"
            :class="resolvedRowClass(row, rowIndex)"
            @click="emit('row-click', row, rowIndex, $event)"
            @dblclick="emit('row-dblclick', row, rowIndex, $event)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.cellClass"
              :style="columnStyle(column)"
              :data-align="column.align ?? 'start'"
              :data-sticky="column.sticky"
              :data-truncate="column.truncate || undefined"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getDataTableCellValue(row, column)"
                :row-index="rowIndex"
              >
                {{ displayValue(row, column) }}
              </slot>
            </td>
          </tr>
          <tr v-if="!loading && lazy && (hasMore || loadingMore)">
            <td :colspan="Math.max(1, columns.length)" class="cui-data-table__lazy-state">
              <slot
                name="loading-more"
                :loading="loadingMore"
                :load-more="() => requestLazyLoad(true)"
              >
                <span v-if="loadingMore" class="cui-data-table__loading">
                  <span class="cui-spinner" aria-hidden="true" />
                  {{ labels.loadingMore }}
                </span>
                <button
                  v-else
                  type="button"
                  class="cui-data-table__load-more"
                  @click="requestLazyLoad(true)"
                >
                  {{ labels.loadMore }}
                </button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer v-if="showPagination || $slots.footer" class="cui-data-table__footer">
      <slot
        name="footer"
        :rows="displayedRows"
        :total="totalRows"
        :page="currentPage"
      >
        <span class="cui-data-table__result-count">
          {{ totalRows }} {{ labels.results }}
        </span>
        <UiPagination
          v-if="showPagination"
          :model-value="currentPage"
          :total="totalRows"
          :page-size="resolvedPageSize"
          :disabled="loading"
          size="sm"
          @update:model-value="emitPage"
        />
      </slot>
    </footer>

    <UiDataTableFilters
      v-if="$slots.filter"
      v-model="filtersOpen"
      :columns="columns"
      :filters="resolvedFilters"
      :labels="labels"
      :teleport="filterDialogTeleport"
      @apply="applyFilters"
    >
      <template #filter="filterProps">
        <slot name="filter" v-bind="filterProps" />
      </template>
    </UiDataTableFilters>
    <UiDataTableFilters
      v-else
      v-model="filtersOpen"
      :columns="columns"
      :filters="resolvedFilters"
      :labels="labels"
      :teleport="filterDialogTeleport"
      @apply="applyFilters"
    />
  </section>
</template>
