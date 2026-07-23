import { mount } from '@vue/test-utils';
import UiSwitch from './UiSwitch.vue';

describe('UiSwitch', () => {
  it('uses a native checkbox with the switch role', () => {
    const wrapper = mount(UiSwitch, { props: { modelValue: true, label: 'Notifications' } });
    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('checkbox');
    expect(input.attributes('role')).toBe('switch');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('emits controlled model updates and change', async () => {
    const wrapper = mount(UiSwitch, { props: { modelValue: false } });
    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('passes native attributes and connects description', () => {
    const wrapper = mount(UiSwitch, {
      props: { description: 'Can be changed later', name: 'notifications' },
      attrs: { 'aria-label': 'Notifications' },
    });
    const input = wrapper.get('input');
    const description = wrapper.get('.cui-switch__description');

    expect(input.attributes('name')).toBe('notifications');
    expect(input.attributes('aria-label')).toBe('Notifications');
    expect(input.attributes('aria-describedby')).toBe(description.attributes('id'));
  });
});


describe('UiSwitch public contract', () => {
  it('forwards form props, explicit id, state, size, and default slot', () => {
    const wrapper = mount(UiSwitch, {
      props: {
        modelValue: true, label: 'Ignored', required: true, disabled: true,
        name: 'updates', size: 'lg',
      },
      attrs: { id: 'updates-id', 'data-testid': 'switch' },
      slots: { default: 'Product updates' },
    });
    const input = wrapper.get('input');
    expect(input.attributes()).toEqual(expect.objectContaining({
      id: 'updates-id', required: '', disabled: '', name: 'updates',
      'data-testid': 'switch',
    }));
    expect(wrapper.attributes('data-size')).toBe('lg');
    expect(wrapper.attributes('data-checked')).toBe('true');
    expect(wrapper.get('.cui-switch__label').text()).toBe('Product updates');
  });

  it('does not emit through native interaction while disabled', async () => {
    const wrapper = mount(UiSwitch, { props: { disabled: true } });
    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('omits optional content and description relation when empty', () => {
    const wrapper = mount(UiSwitch);
    expect(wrapper.find('.cui-switch__content').exists()).toBe(false);
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined();
  });
});
