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


describe('UiSelect complete public contract', () => {
  it('does not open when disabled and exposes disabled semantics', async () => {
    const wrapper = mountSelect({ disabled: true });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.attributes('aria-disabled')).toBe('true');
    expect(trigger.attributes('tabindex')).toBe('-1');
    expect(wrapper.emitted('open')).toBeUndefined();
    wrapper.unmount();
  });

  it('toggles closed on a second click', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await trigger.trigger('click');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('blocks selection while loading and renders loading semantics and slot', async () => {
    const wrapper = mount(UiSelect, {
      attachTo: document.body,
      props: { options, loading: true },
      slots: { loading: 'Fetching options' },
    });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await wrapper.findAll('[role="option"]')[0]?.trigger('click');
    expect(trigger.attributes('aria-busy')).toBe('true');
    expect(wrapper.get('[role="status"]').text()).toBe('Fetching options');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    wrapper.unmount();
  });

  it('removes an existing multiple value without mutating the prop', async () => {
    const initial = ['alpha', 'beta'];
    const wrapper = mountSelect({ modelValue: initial, multiple: true });
    await wrapper.get('.cui-select__chip-remove').trigger('click');
    expect(initial).toEqual(['alpha', 'beta']);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['beta']]);
    wrapper.unmount();
  });

  it('toggles an already selected option out of multiple value', async () => {
    const wrapper = mountSelect({ modelValue: ['alpha'], multiple: true });
    await wrapper.get('.cui-select__control').trigger('click');
    await wrapper.findAll('[role="option"]')[0]?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);
    wrapper.unmount();
  });

  it('clears multiple selection to a new empty array', async () => {
    const wrapper = mountSelect({
      modelValue: ['alpha'], multiple: true, clearable: true,
    });
    await wrapper.get('.cui-select__clear').trigger('click');
    const value = wrapper.emitted('update:modelValue')?.[0]?.[0];
    expect(value).toEqual([]);
    expect(value).not.toBe(wrapper.props('modelValue'));
    expect(wrapper.emitted('clear')).toHaveLength(1);
    wrapper.unmount();
  });

  it.each([{ disabled: true }, { loading: true }])(
    'does not remove or clear values in protected state %o',
    (state) => {
      const wrapper = mountSelect({
        modelValue: ['alpha'], multiple: true, clearable: true, ...state,
      });
      wrapper.get('.cui-select__chip-remove').element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
      wrapper.get('.cui-select__clear').element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      wrapper.unmount();
    },
  );

  it.each([
    [240, 'max-block-size: 240px'],
    ['50vh', 'max-block-size: 50vh'],
  ] as const)('supports maxMenuHeight value %s', async (maxMenuHeight, expectedStyle) => {
    const wrapper = mountSelect({ maxMenuHeight });
    await wrapper.get('.cui-select__control').trigger('click');
    expect(wrapper.get('.cui-select__menu').attributes('style')).toContain(expectedStyle);
    wrapper.unmount();
  });

  it('renders labels, hint, error, attrs, and visual state props accessibly', async () => {
    const hintWrapper = mountSelect({
      label: 'Plan', hint: 'Choose one', placeholder: 'Pick', size: 'lg',
    });
    const hintTrigger = hintWrapper.get('.cui-select__control');
    expect(hintTrigger.attributes('aria-labelledby')).toBe(
      hintWrapper.get('.cui-field__label').attributes('id'),
    );
    expect(hintTrigger.attributes('aria-describedby')).toContain(
      hintWrapper.get('.cui-field__message').attributes('id'),
    );
    expect(hintWrapper.attributes('data-size')).toBe('lg');
    hintWrapper.unmount();

    const errorWrapper = mount(UiSelect, {
      props: { options, hint: 'Hint', error: 'Required' },
      attrs: { id: 'plan-select', 'aria-describedby': 'external', class: 'native-class' },
    });
    const errorTrigger = errorWrapper.get('.cui-select__control');
    expect(errorTrigger.attributes('id')).toBe('plan-select');
    expect(errorTrigger.classes()).toContain('native-class');
    expect(errorTrigger.attributes('aria-invalid')).toBe('true');
    expect(errorTrigger.attributes('aria-describedby')).toContain('external');
    expect(errorTrigger.attributes('aria-describedby')).toContain(
      errorWrapper.get('.cui-field__message--error').attributes('id'),
    );
    expect(errorWrapper.text()).not.toContain('Hint');
  });

  it('renders prefix, suffix, selected, option, and empty slots with slot props', async () => {
    const wrapper = mount(UiSelect, {
      attachTo: document.body,
      props: { options, modelValue: 'alpha', searchable: true },
      slots: {
        prefix: '<span data-prefix>P</span>',
        suffix: '<span data-suffix>S</span>',
        selected: '<template #default="{ values }"><span data-selected>{{ values.join(",") }}</span></template>',
        option: '<template #default="{ option, selected }"><span data-option>{{ option.label }}:{{ selected }}</span></template>',
      },
    });
    expect(wrapper.get('[data-prefix]').text()).toBe('P');
    expect(wrapper.get('[data-suffix]').text()).toBe('S');
    expect(wrapper.get('[data-selected]').text()).toBe('alpha');
    await wrapper.get('.cui-select__control').trigger('click');
    expect(wrapper.findAll('[data-option]')[0]?.text()).toBe('Alpha:true');
    wrapper.unmount();

    const empty = mount(UiSelect, {
      props: { options: [], searchable: true },
      slots: {
        empty: '<template #default="{ searchQuery }"><span data-empty>Query:{{ searchQuery }}</span></template>',
      },
    });
    await empty.get('.cui-select__control').trigger('click');
    await empty.get('.cui-select__search').setValue('none');
    expect(empty.get('[data-empty]').text()).toBe('Query:none');
  });

  it('clears search and emits an empty query when closing', async () => {
    const wrapper = mountSelect({ searchable: true });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await wrapper.get('.cui-select__search').setValue('beta');
    await wrapper.get('.cui-select__search').trigger('keydown', { key: 'Tab' });
    expect(wrapper.emitted('search')).toEqual([['beta'], ['']]);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('closes on outside pointer interaction without restoring focus', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await nextTick();
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('closes reactively when it becomes disabled', async () => {
    const wrapper = mountSelect();
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await wrapper.setProps({ disabled: true });
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('supports complete keyboard navigation from search input', async () => {
    const wrapper = mountSelect({ searchable: true });
    await wrapper.get('.cui-select__control').trigger('click');
    const search = wrapper.get('.cui-select__search');

    await search.trigger('keydown', { key: 'End' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Beta');
    await search.trigger('keydown', { key: 'Home' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Alpha');
    await search.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Beta');
    await search.trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.get('[data-active="true"]').text()).toContain('Alpha');
    await search.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['alpha']);
    wrapper.unmount();
  });

  it('handles a list with no enabled options without an active descendant', async () => {
    const wrapper = mountSelect({
      options: [
        { label: 'One', value: 'one', disabled: true },
        { label: 'Two', value: 'two', disabled: true },
      ],
    });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('keydown', { key: 'ArrowUp' });
    await trigger.trigger('keydown', { key: 'End' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    wrapper.unmount();
  });

  it('updates active option on mouseenter but ignores disabled options', async () => {
    const wrapper = mountSelect();
    await wrapper.get('.cui-select__control').trigger('click');
    const optionNodes = wrapper.findAll('[role="option"]');
    await optionNodes[1]?.trigger('mouseenter');
    expect(optionNodes[1]?.attributes('data-active')).toBe('true');
    await optionNodes[2]?.trigger('mouseenter');
    expect(optionNodes[1]?.attributes('data-active')).toBe('true');
    wrapper.unmount();
  });

  it('emits focus and blur only when focus crosses the component boundary', async () => {
    const wrapper = mountSelect({ searchable: true });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('focusin', { relatedTarget: document.body });
    await trigger.trigger('focusin', { relatedTarget: trigger.element });
    await trigger.trigger('focusout', { relatedTarget: trigger.element });
    await trigger.trigger('focusout', { relatedTarget: document.body });
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
    wrapper.unmount();
  });

  it('focuses the trigger when its label is clicked', async () => {
    const wrapper = mountSelect({ label: 'Country' });
    await wrapper.get('.cui-field__label').trigger('click');
    expect(document.activeElement).toBe(wrapper.get('.cui-select__control').element);
    wrapper.unmount();
  });
});


describe('UiSelect rapid keyboard edge cases', () => {
  it.each([
    ['ArrowDown', 'Alpha'],
    ['ArrowUp', 'Alpha'],
  ])('moves from a reset active index with %s', async (key, expected) => {
    const wrapper = mountSelect({ searchable: true });
    await wrapper.get('.cui-select__control').trigger('click');
    const search = wrapper.get<HTMLInputElement>('.cui-select__search');
    search.element.value = 'a';
    search.element.dispatchEvent(new Event('input', { bubbles: true }));
    search.element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect(wrapper.get('[data-active="true"]').text()).toContain(expected);
    wrapper.unmount();
  });

  it('ignores keyboard events bubbling from a nested control', () => {
    const wrapper = mountSelect({ modelValue: 'alpha', clearable: true });
    wrapper.get('.cui-select__clear').element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(wrapper.get('.cui-select__control').attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('open')).toBeUndefined();
    wrapper.unmount();
  });
});


describe('UiSelect unavailable option navigation', () => {
  it('keeps no active option in an empty list', async () => {
    const wrapper = mountSelect({ options: [] });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined();
    wrapper.unmount();
  });

  it('keeps no active option when every option is disabled', async () => {
    const wrapper = mountSelect({
      options: [
        { label: 'One', value: 'one', disabled: true },
        { label: 'Two', value: 'two', disabled: true },
      ],
    });
    const trigger = wrapper.get('.cui-select__control');
    await trigger.trigger('click');
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined();
    wrapper.unmount();
  });
});


describe('UiSelect dropdown anchor', () => {
  it('anchors the menu to the control instead of hint or error content', async () => {
    const wrapper = mountSelect({ hint: 'Helpful text' });
    await wrapper.get('.cui-select__control').trigger('click');

    const anchor = wrapper.get('.cui-select__anchor');
    expect(anchor.find('.cui-select__control').exists()).toBe(true);
    expect(anchor.find('.cui-select__menu').exists()).toBe(true);
    expect(anchor.find('.cui-field__message').exists()).toBe(false);
    expect(wrapper.get('.cui-field__message').element.parentElement).toBe(wrapper.element);
    wrapper.unmount();
  });
});
