import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import UiDataTable from './UiDataTable.vue';
import UiDataTableFilters from './UiDataTableFilters.vue';
import type {
  UiDataTableColumn,
  UiDataTableFilterValues,
  UiDataTableSort,
} from './UiDataTable.types';

interface Row {
  id: number;
  name: string;
  role: string;
  age: number;
}

const rows: Row[] = [
  { id: 1, name: 'Anna', role: 'design', age: 28 },
  { id: 2, name: 'Boris', role: 'dev', age: 34 },
  { id: 3, name: 'Victor', role: 'dev', age: 23 },
];

const columns: UiDataTableColumn<Row>[] = [
  { key: 'name', label: 'Name', sortable: true, filter: { type: 'text' } },
  {
    key: 'role',
    label: 'Role',
    filter: {
      type: 'select',
      options: [
        { label: 'Design', value: 'design' },
        { label: 'Development', value: 'dev' },
      ],
    },
  },
  { key: 'age', label: 'Age', sortable: true, filter: { type: 'number-range' } },
];

describe('UiDataTable', () => {
  it('renders columns, formatted cells, caption and custom cell slots', () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows,
        columns: [
          columns[0]!,
          { key: 'age', label: 'Age', format: (value) => `${value} years` },
        ],
        caption: 'People',
        rowKey: 'id',
        pagination: false,
      },
      slots: {
        'cell-name': '<template #cell-name="{ value }"><strong>{{ value }}</strong></template>',
      },
    });

    expect(wrapper.get('caption').text()).toBe('People');
    expect(wrapper.findAll('thead th')).toHaveLength(2);
    expect(wrapper.findAll('tbody tr')).toHaveLength(3);
    expect(wrapper.get('strong').text()).toBe('Anna');
    expect(wrapper.text()).toContain('28 years');
  });

  it('cycles sorting and resets the page', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: { rows, columns, sort: null, page: 2 },
    });
    const sortButton = wrapper.get('.cui-data-table__sort');

    await sortButton.trigger('click');
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([{ key: 'name', direction: 'asc' }]);
    expect(wrapper.emitted('update:page')?.[0]).toEqual([1]);

    await wrapper.setProps({ sort: { key: 'name', direction: 'asc' } });
    await sortButton.trigger('click');
    expect(wrapper.emitted('update:sort')?.[1]).toEqual([{ key: 'name', direction: 'desc' }]);

    await wrapper.setProps({ sort: { key: 'name', direction: 'desc' } });
    await sortButton.trigger('click');
    expect(wrapper.emitted('update:sort')?.[2]).toEqual([null]);
  });

  it('filters and paginates rows locally', () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows,
        columns,
        filters: { role: 'dev' },
        sort: { key: 'age', direction: 'asc' },
        pageSize: 1,
        page: 1,
      },
    });

    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(wrapper.text()).toContain('Victor');
    expect(wrapper.findAll('[aria-label^="Page"]')).toHaveLength(2);
    expect(wrapper.get('.cui-data-table__filter-count').text()).toContain('1');
  });

  it('renders loading and empty states', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: { rows: [], columns, loading: true },
    });
    expect(wrapper.get('.cui-data-table__loading').text()).toContain('Loading');
    await wrapper.setProps({ loading: false });
    expect(wrapper.get('.cui-data-table__state').text()).toBe('No matching rows');
  });

  it('supports sticky columns, dense layout, borders, truncation and row classes', () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows,
        columns: [
          {
            ...columns[0]!,
            sticky: 'start',
            stickyOffset: 12,
            truncate: true,
            width: 180,
          },
          { ...columns[1]!, sticky: 'end' },
        ],
        rowClass: (row) => row.role === 'dev' ? 'is-developer' : undefined,
        dense: true,
        bordered: true,
        tableMinWidth: 720,
        tableLayout: 'fixed',
        pagination: false,
      },
    });

    expect(wrapper.attributes('data-dense')).toBe('true');
    expect(wrapper.attributes('data-bordered')).toBe('true');
    expect(wrapper.get('table').attributes('style')).toContain('min-width: 720px');
    expect(wrapper.get('th[data-sticky="start"]').attributes('style'))
      .toContain('--cui-data-table-sticky-start: 12px');
    expect(wrapper.find('td[data-truncate="true"]').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr')[1]!.classes()).toContain('is-developer');
  });

  it('requests more rows near the end and keeps existing rows visible', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows: rows.slice(0, 2),
        columns,
        lazy: true,
        hasMore: true,
        loadingMore: false,
        maxHeight: 240,
      },
    });
    await nextTick();

    expect(wrapper.findAll('tbody tr')).toHaveLength(3);
    expect(wrapper.emitted('load-more')?.[0]).toEqual([{
      offset: 2,
      sort: null,
      filters: {},
    }]);

    await wrapper.setProps({ loadingMore: true });
    expect(wrapper.get('.cui-data-table__lazy-state').text()).toContain('Loading more rows');
    expect(wrapper.text()).toContain('Anna');
  });

  it('allows a manual lazy-load retry from the fallback button', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows,
        columns,
        lazy: true,
        hasMore: true,
      },
    });
    await nextTick();
    const initialCalls = wrapper.emitted('load-more')?.length ?? 0;
    await wrapper.get('.cui-data-table__load-more').trigger('click');
    expect(wrapper.emitted('load-more')).toHaveLength(initialCalls + 1);
  });

  it('emits row interactions and supports toolbar and footer slots', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: { rows, columns, pagination: false },
      slots: {
        toolbar: '<span data-toolbar>Tools</span>',
        footer: '<span data-footer>Footer</span>',
      },
    });

    await wrapper.findAll('tbody tr')[0]!.trigger('click');
    expect(wrapper.emitted('row-click')?.[0]?.[0]).toEqual(rows[0]);
    expect(wrapper.get('[data-toolbar]').text()).toBe('Tools');
    expect(wrapper.get('[data-footer]').text()).toBe('Footer');
  });

  it('applies filters from the separate dialog', async () => {
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows,
        columns,
        filters: {},
        filterDialogTeleport: false,
      },
    });

    await wrapper.get('.cui-data-table__toolbar .cui-button').trigger('click');
    await nextTick();
    const input = wrapper.get('.cui-data-table-filters .cui-input__native');
    await input.setValue('bor');
    const apply = wrapper.findAll('.cui-dialog__footer .cui-button').at(-1)!;
    await apply.trigger('click');
    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ name: 'bor' }]);
  });
});

describe('UiDataTableFilters', () => {
  it('supports custom filter content and reset', async () => {
    const filters: UiDataTableFilterValues = { name: 'Anna' };
    const wrapper = mount(UiDataTableFilters<Row>, {
      props: {
        modelValue: true,
        columns: [{ key: 'name', label: 'Name', filter: { type: 'custom' } }],
        filters,
        teleport: false,
      },
      slots: {
        filter: '<template #filter="{ value }"><span data-custom>{{ value }}</span></template>',
      },
    });

    expect(wrapper.get('[data-custom]').text()).toBe('Anna');
    await wrapper.findAll('.cui-dialog__footer .cui-button')[0]!.trigger('click');
    expect(wrapper.emitted('reset')).toHaveLength(1);
  });

  it('accepts localized labels', () => {
    const sort: UiDataTableSort = { key: 'name', direction: 'asc' };
    expect(sort.direction).toBe('asc');
    const wrapper = mount(UiDataTable<Row>, {
      props: {
        rows: [],
        columns,
        labels: { filters: 'Фильтры', empty: 'Ничего нет' },
      },
    });
    expect(wrapper.get('.cui-data-table__toolbar .cui-button').text()).toContain('Фильтры');
    expect(wrapper.text()).toContain('Ничего нет');
  });
});
