import { mount } from '@vue/test-utils';
import UiCheckbox from './UiCheckbox.vue';

describe('UiCheckbox', () => {
  it('emits controlled model updates and change', async () => {
    const wrapper = mount(UiCheckbox, { props: { modelValue: false } });
    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('connects description and native attributes', () => {
    const wrapper = mount(UiCheckbox, {
      props: { label: 'Terms', description: 'Required to continue', name: 'terms' },
      attrs: { 'data-testid': 'terms-checkbox' },
    });
    const input = wrapper.get('input');
    const description = wrapper.get('.cui-choice__description');

    expect(input.attributes('name')).toBe('terms');
    expect(input.attributes('data-testid')).toBe('terms-checkbox');
    expect(input.attributes('aria-describedby')).toBe(description.attributes('id'));
  });

  it('reflects the indeterminate property', () => {
    const wrapper = mount(UiCheckbox, { props: { indeterminate: true } });
    expect((wrapper.get('input').element as HTMLInputElement).indeterminate).toBe(true);
  });

  it('does not emit when disabled', async () => {
    const wrapper = mount(UiCheckbox, { props: { disabled: true } });
    await wrapper.get('input').trigger('change');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
