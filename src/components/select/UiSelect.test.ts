import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import UiSelect from './UiSelect.vue';
import type { UiSelectOption, UiSelectProps } from './UiSelect.types';

const options: UiSelectOption[] = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma', disabled: true },
];

function mountSelect(props: Partial<UiSelectProps> = {}) {
  return mount(UiSelect, {
    attachTo: document.body,
    props: {
      options,
      ...props,
    },
  });
}

describe('UiSelect', () => {
  it('opens and closes the dropdown', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');

    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.emitted('open')).toHaveLength(1);

    await trigger.trigger('keydown', { key: 'Escape' });
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('selects a value in single mode', async () => {
    const wrapper = mountSelect();
    await wrapper.get('.cui-select__control').trigger('click');
    await wrapper.findAll('[role="option"]')[1]?.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta']);
    wrapper.unmount();
  });

  it('keeps multiple mode open by default and respects closeOnSelect', async () => {
    const multipleWrapper = mountSelect({ multiple: true, modelValue: [] });
    const multipleTrigger = multipleWrapper.get('.cui-select__control');

    await multipleTrigger.trigger('click');
    await multipleWrapper.findAll('[role="option"]')[0]?.trigger('click');
    expect(multipleTrigger.attributes('aria-expanded')).toBe('true');
    multipleWrapper.unmount();

    const controlledWrapper = mountSelect({ closeOnSelect: false });
    const controlledTrigger = controlledWrapper.get('.cui-select__control');

    await controlledTrigger.trigger('click');
    await controlledWrapper.findAll('[role="option"]')[0]?.trigger('click');
    expect(controlledTrigger.attributes('aria-expanded')).toBe('true');
    controlledWrapper.unmount();
  });

  it('returns a new array without mutating multiple modelValue', async () => {
    const initial = ['alpha'];
    const wrapper = mountSelect({ modelValue: initial, multiple: true });
    await wrapper.get('.cui-select__control').trigger('click');
    await wrapper.findAll('[role="option"]')[1]?.trigger('click');

    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0];
    expect(initial).toEqual(['alpha']);
    expect(emittedValue).toEqual(['alpha', 'beta']);
    expect(emittedValue).not.toBe(initial);
    wrapper.unmount();
  });

  it('filters options locally and emits search', async () => {
    const wrapper = mountSelect({ searchable: true });
    await wrapper.get('.cui-select__control').trigger('click');
    await wrapper.get('.cui-select__search').setValue('be');

    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    expect(wrapper.get('[role="option"]').text()).toContain('Beta');
    expect(wrapper.emitted('search')?.[0]).toEqual(['be']);
    wrapper.unmount();
  });

  it('does not select a disabled option', async () => {
    const wrapper = mountSelect();
    await wrapper.get('.cui-select__control').trigger('click');
    await wrapper.findAll('[role="option"]')[2]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    wrapper.unmount();
  });

  it('supports ArrowDown, ArrowUp, Enter, and Escape', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Alpha');

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Beta');

    await trigger.trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Alpha');

    await trigger.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['alpha']);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('supports Home, End, Space, and Tab without trapping focus', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');

    await trigger.trigger('keydown', { key: ' ' });
    expect(trigger.attributes('aria-expanded')).toBe('true');

    await trigger.trigger('keydown', { key: 'End' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Beta');

    await trigger.trigger('keydown', { key: 'Home' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Alpha');

    await trigger.trigger('keydown', { key: 'Tab' });
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('returns focus to the trigger after Escape', async () => {
    const wrapper = mountSelect({ searchable: true });
    const trigger = wrapper.get('.cui-select__control');

    await trigger.trigger('click');
    const search = wrapper.get<HTMLInputElement>('.cui-select__search');
    expect(document.activeElement).toBe(search.element);

    await search.trigger('keydown', { key: 'Escape' });
    await nextTick();
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('marks selected options and renders hidden inputs', async () => {
    const wrapper = mountSelect({
      modelValue: ['alpha', 'beta'],
      multiple: true,
      name: 'tags',
    });
    await wrapper.get('.cui-select__control').trigger('click');

    const selected = wrapper.findAll('[role="option"][aria-selected="true"]');
    const hiddenInputs = wrapper.findAll('input[type="hidden"]');
    expect(selected).toHaveLength(2);
    expect(hiddenInputs.map((input) => input.attributes('value'))).toEqual(['alpha', 'beta']);
    expect(hiddenInputs.every((input) => input.attributes('name') === 'tags')).toBe(true);
    wrapper.unmount();
  });

  it('clears the selected value', async () => {
    const wrapper = mountSelect({ modelValue: 'alpha', clearable: true });
    await wrapper.get('.cui-select__clear').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
    expect(wrapper.emitted('clear')).toHaveLength(1);
    wrapper.unmount();
  });

  it('renders no-options and no-results states', async () => {
    const emptyWrapper = mountSelect({ options: [], noOptionsText: 'Nothing here' });
    await emptyWrapper.get('.cui-select__control').trigger('click');
    expect(emptyWrapper.get('.cui-select__state').text()).toBe('Nothing here');
    emptyWrapper.unmount();

    const noResultsWrapper = mountSelect({ searchable: true, noResultsText: 'No match' });
    await noResultsWrapper.get('.cui-select__control').trigger('click');
    await noResultsWrapper.get('.cui-select__search').setValue('zzz');
    expect(noResultsWrapper.get('.cui-select__state').text()).toBe('No match');
    noResultsWrapper.unmount();
  });
});
