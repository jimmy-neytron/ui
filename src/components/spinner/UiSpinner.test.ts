import { mount } from '@vue/test-utils';
import UiSpinner from './UiSpinner.vue';

describe('UiSpinner', () => {
  it('renders accessible defaults', () => {
    const wrapper = mount(UiSpinner);
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-label')).toBe('Loading');
    expect(wrapper.attributes('data-size')).toBe('md');
    expect(wrapper.attributes('data-tone')).toBe('current');
    expect(wrapper.get('.cui-loader__circle').attributes('aria-hidden')).toBe('true');
  });

  it('supports a localized label', () => {
    expect(mount(UiSpinner, { props: { label: 'Загрузка' } }).attributes('aria-label'))
      .toBe('Загрузка');
  });

  it('becomes hidden from assistive technology when decorative', () => {
    const wrapper = mount(UiSpinner, { props: { decorative: true } });
    expect(wrapper.attributes('aria-hidden')).toBe('true');
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('aria-label')).toBeUndefined();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
    expect(mount(UiSpinner, { props: { size } }).attributes('data-size')).toBe(size);
  });

  it.each(['current', 'primary', 'muted', 'inverted'] as const)('renders %s tone', (tone) => {
    expect(mount(UiSpinner, { props: { tone } }).attributes('data-tone')).toBe(tone);
  });

  it('forwards native attributes and merges classes', () => {
    const wrapper = mount(UiSpinner, {
      attrs: { id: 'page-loader', class: 'custom-loader', 'data-testid': 'spinner' },
    });
    expect(wrapper.attributes('id')).toBe('page-loader');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['cui-loader', 'custom-loader']));
    expect(wrapper.attributes('data-testid')).toBe('spinner');
  });
});
