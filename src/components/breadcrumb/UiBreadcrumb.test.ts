import { mount } from '@vue/test-utils';
import UiBreadcrumb from './UiBreadcrumb.vue';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Disabled', href: '/x', disabled: true },
  { label: 'Current', href: '/current' },
];

describe('UiBreadcrumb', () => {
  it('renders array items with navigation semantics and the current page', () => {
    const wrapper = mount(UiBreadcrumb, { props: { items, ariaLabel: 'Path' } });

    expect(wrapper.attributes('aria-label')).toBe('Path');
    expect(wrapper.findAll('a')).toHaveLength(1);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Current');
    expect(wrapper.get('[aria-disabled="true"]').text()).toBe('Disabled');
    expect(wrapper.findAll('.cui-breadcrumb__separator')).toHaveLength(2);
    expect(wrapper.findAll('.cui-breadcrumb__separator svg')).toHaveLength(2);
  });

  it('accepts an object map and preserves its item order', () => {
    const wrapper = mount(UiBreadcrumb, {
      props: {
        items: {
          home: { label: 'Home', href: '/' },
          catalog: { label: 'Catalog', href: '/catalog' },
          product: { label: 'Product' },
        },
      },
    });

    expect(wrapper.findAll('.cui-breadcrumb__item').map((item) => item.text())).toEqual([
      'Home',
      'Catalog',
      'Product',
    ]);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Product');
  });

  it('accepts a single item object', () => {
    const wrapper = mount(UiBreadcrumb, { props: { items: { label: 'Current page' } } });

    expect(wrapper.findAll('.cui-breadcrumb__item')).toHaveLength(1);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Current page');
    expect(wrapper.find('.cui-breadcrumb__separator').exists()).toBe(false);
  });

  it('renders item and separator slots', () => {
    const wrapper = mount(UiBreadcrumb, {
      props: { items: items.slice(0, 2) },
      slots: {
        item: '<template #default="{ item }"><b>{{ item.label }}</b></template>',
        separator: '<span data-separator>→</span>',
      },
    });

    expect(wrapper.findAll('b')).toHaveLength(2);
    expect(wrapper.get('[data-separator]').text()).toBe('→');
    expect(wrapper.find('.cui-breadcrumb__separator svg').exists()).toBe(false);
  });

  it('forwards native attributes', () => {
    expect(mount(UiBreadcrumb, { props: { items: [] }, attrs: { id: 'path' } }).attributes('id')).toBe('path');
  });
});