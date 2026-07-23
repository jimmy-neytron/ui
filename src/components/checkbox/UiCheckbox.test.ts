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


describe('UiCheckbox public contract', () => {
  it('forwards every form prop, explicit id, size, and default slot', () => {
    const wrapper = mount(UiCheckbox, {
      props: {
        modelValue: true, label: 'Ignored', required: true, name: 'terms',
        value: 7, size: 'lg',
      },
      attrs: { id: 'terms-id' },
      slots: { default: 'Accept terms' },
    });
    const input = wrapper.get('input');
    expect(input.attributes()).toEqual(expect.objectContaining({
      id: 'terms-id', required: '', name: 'terms', value: '7',
    }));
    expect(wrapper.attributes('data-size')).toBe('lg');
    expect(wrapper.attributes('data-checked')).toBe('true');
    expect(wrapper.get('.cui-choice__label').text()).toBe('Accept terms');
  });

  it('reactively updates checked and indeterminate DOM properties', async () => {
    const wrapper = mount(UiCheckbox, {
      props: { modelValue: false, indeterminate: false },
    });
    await wrapper.setProps({ modelValue: true, indeterminate: true });
    const input = wrapper.get<HTMLInputElement>('input').element;
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(true);
  });

  it('omits optional content and description relation when empty', () => {
    const wrapper = mount(UiCheckbox);
    expect(wrapper.find('.cui-choice__content').exists()).toBe(false);
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined();
  });
});
