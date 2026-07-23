import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import UiConfigProvider from '../config-provider/UiConfigProvider.vue';
import UiPagination from './UiPagination.vue';

describe('UiPagination', () => {
  it('renders all pages for a small set and selects a page', async () => {
    const wrapper = mount(UiPagination, { props: { total: 50, pageSize: 10, modelValue: 1 } });
    expect(wrapper.findAll('[aria-label^="Page"]')).toHaveLength(5);
    await wrapper.get('[aria-label="Page 3"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
    expect(wrapper.emitted('change')?.[0]).toEqual([3]);
  });
  it('renders both ellipses for large sets', () => {
    expect(mount(UiPagination, { props: { total: 200, pageSize: 10, modelValue: 10, siblingCount: 1 } }).findAll('.cui-pagination__ellipsis')).toHaveLength(2);
  });
  it('renders edge ranges and clamps invalid inputs', () => {
    expect(mount(UiPagination, { props: { total: -1, pageSize: 0, modelValue: 99 } }).findAll('[aria-label^="Page"]')).toHaveLength(1);
    expect(mount(UiPagination, { props: { total: 200, modelValue: 1 } }).findAll('.cui-pagination__ellipsis')).toHaveLength(1);
    expect(mount(UiPagination, { props: { total: 200, modelValue: 20 } }).findAll('.cui-pagination__ellipsis')).toHaveLength(1);
  });
  it('blocks navigation while disabled', async () => {
    const wrapper = mount(UiPagination, { props: { total: 20, modelValue: 1, disabled: true } });
    await wrapper.get('[aria-label="Page 1"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
  it('uses localized navigation labels', () => {
    const Host = defineComponent({ components: { UiConfigProvider, UiPagination }, template: '<UiConfigProvider :locale="{ previousPage: \'Back\', nextPage: \'Forward\' }"><UiPagination :total="20" /></UiConfigProvider>' });
    const wrapper = mount(Host);
    expect(wrapper.get('[aria-label="Back"]').attributes('aria-label')).toBe('Back');
    expect(wrapper.get('[aria-label="Forward"]').attributes('aria-label')).toBe('Forward');
  });
});