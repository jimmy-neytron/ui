import { mount } from '@vue/test-utils';
import UiInput from './UiInput.vue';

describe('UiInput', () => {
  it('emits model updates', async () => {
    const wrapper = mount(UiInput, { props: { modelValue: '' } });
    await wrapper.get('input').setValue('Compact');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Compact']);
  });

  it('passes native attributes to the input', () => {
    const wrapper = mount(UiInput, {
      attrs: { 'data-testid': 'native-input', 'aria-label': 'Search' },
    });
    const input = wrapper.get('input');
    expect(input.attributes('data-testid')).toBe('native-input');
    expect(input.attributes('aria-label')).toBe('Search');
  });

  it('connects label, error, and aria attributes', () => {
    const wrapper = mount(UiInput, {
      props: { label: 'Email', error: 'Required' },
    });
    const input = wrapper.get('input');
    const label = wrapper.get('label');
    const message = wrapper.get('.cui-field__message--error');

    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toContain(message.attributes('id'));
    expect(message.text()).toBe('Required');
  });

  it('connects a hint through aria-describedby', () => {
    const wrapper = mount(UiInput, { props: { hint: 'Use a work address' } });
    const hint = wrapper.get('.cui-field__message');
    expect(wrapper.get('input').attributes('aria-describedby')).toContain(hint.attributes('id'));
  });

  it('clears the value and emits clear', async () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: 'value', clearable: true },
    });
    await wrapper.get('.cui-input__clear').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });
});
