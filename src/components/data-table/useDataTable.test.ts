import { computed, ref } from 'vue';
import {
  filterDataTableRows,
  getDataTableCellValue,
  isDataTableFilterActive,
  sortDataTableRows,
  useDataTable,
} from './useDataTable';
import type {
  UiDataTableColumn,
  UiDataTableFilterValues,
  UiDataTableSort,
} from './UiDataTable.types';

interface Person {
  id: number;
  name: string;
  role: string;
  age: number;
}

const rows: Person[] = [
  { id: 1, name: 'Анна', role: 'design', age: 28 },
  { id: 2, name: 'Борис', role: 'dev', age: 34 },
  { id: 3, name: 'Виктор', role: 'dev', age: 23 },
];

const columns: UiDataTableColumn<Person>[] = [
  { key: 'name', label: 'Имя', sortable: true, filter: { type: 'text' } },
  {
    key: 'role',
    label: 'Роль',
    filter: {
      type: 'select',
      options: [
        { label: 'Design', value: 'design' },
        { label: 'Dev', value: 'dev' },
      ],
    },
  },
  { key: 'age', label: 'Возраст', sortable: true, filter: { type: 'number-range' } },
];

describe('data table processing', () => {
  it('resolves direct and computed accessors', () => {
    expect(getDataTableCellValue(rows[0]!, columns[0]!)).toBe('Анна');
    expect(getDataTableCellValue(rows[0]!, {
      key: 'summary',
      label: 'Summary',
      accessor: (row) => `${row.name}: ${row.age}`,
    })).toBe('Анна: 28');
  });

  it('detects active scalar, array and range filters', () => {
    expect(isDataTableFilterActive('')).toBe(false);
    expect(isDataTableFilterActive([])).toBe(false);
    expect(isDataTableFilterActive({ min: undefined, max: undefined })).toBe(false);
    expect(isDataTableFilterActive({ min: 20 })).toBe(true);
    expect(isDataTableFilterActive(['dev'])).toBe(true);
  });

  it('combines text, select and number range filters', () => {
    expect(filterDataTableRows(rows, columns, { name: 'бор' })).toEqual([rows[1]]);
    expect(filterDataTableRows(rows, columns, { role: ['dev'] })).toEqual([rows[1], rows[2]]);
    expect(filterDataTableRows(rows, columns, { role: 'dev', age: { min: 30 } }))
      .toEqual([rows[1]]);
  });

  it('supports custom predicates', () => {
    const customColumns: UiDataTableColumn<Person>[] = [{
      key: 'age',
      label: 'Возраст',
      filter: {
        type: 'custom',
        predicate: (value, filter) => Number(value) % Number(filter) === 0,
      },
    }];
    expect(filterDataTableRows(rows, customColumns, { age: 2 })).toEqual([rows[0], rows[1]]);
  });

  it('sorts values stably in both directions and supports comparators', () => {
    expect(sortDataTableRows(rows, columns, { key: 'age', direction: 'asc' }))
      .toEqual([rows[2], rows[0], rows[1]]);
    expect(sortDataTableRows(rows, columns, { key: 'age', direction: 'desc' }))
      .toEqual([rows[1], rows[0], rows[2]]);

    const comparatorColumns: UiDataTableColumn<Person>[] = [{
      key: 'name',
      label: 'Имя',
      sortable: true,
      comparator: (left, right) => left.name.length - right.name.length,
    }];
    expect(sortDataTableRows(rows, comparatorColumns, { key: 'name', direction: 'asc' })[0])
      .toBe(rows[0]);
  });

  it('provides reactive filtering, sorting and pagination', () => {
    const sort = ref<UiDataTableSort | null>({ key: 'age', direction: 'asc' });
    const filters = ref<UiDataTableFilterValues>({ role: 'dev' });
    const page = ref(1);
    const table = useDataTable({
      rows,
      columns,
      sort,
      filters,
      page,
      pageSize: 1,
    });

    expect(table.filteredRows.value).toHaveLength(2);
    expect(table.displayedRows.value).toEqual([rows[2]]);
    page.value = 2;
    expect(table.displayedRows.value).toEqual([rows[1]]);
    filters.value = {};
    expect(computed(() => table.pageCount.value).value).toBe(3);
  });

  it('leaves processing to the consumer in manual modes', () => {
    const table = useDataTable({
      rows,
      columns,
      sort: { key: 'age', direction: 'desc' },
      filters: { role: 'missing' },
      page: 2,
      pageSize: 1,
      manualFiltering: true,
      manualSorting: true,
      manualPagination: true,
    });

    expect(table.displayedRows.value).toEqual(rows);
  });
});
