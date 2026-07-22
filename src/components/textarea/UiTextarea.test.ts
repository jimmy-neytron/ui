import { mount } from '@vue/test-utils';
import UiTextarea from './UiTextarea.vue';

describe('UiTextarea', () => {
  it('emits model updates', async () => {
    const wrapper = mount(UiTextarea, { props: { modelValue: '' } });
    await wrapper.get('textarea').setValue('A longer note');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['A longer note']);
  });

  it('renders a deterministic character count', () => {
    const wrapper = mount(UiTextarea, {
      props: { modelValue: 'hello', maxlength: 20, showCount: true },
    });
    expect(wrapper.get('.cui-textarea__count').text()).toContain('5 / 20');
  });

  it('applies the requested resize mode', () => {
    const wrapper = mount(UiTextarea, { props: { resize: 'horizontal' } });
    expect(wrapper.get('textarea').attributes('style')).toContain('resize: horizontal');
  });

  it('connects errors through aria attributes', () => {
    const wrapper = mount(UiTextarea, {
      props: { label: 'Description', error: 'Too short' },
    });
    const textarea = wrapper.get('textarea');
    const error = wrapper.get('.cui-field__message--error');

    expect(wrapper.get('label').attributes('for')).toBe(textarea.attributes('id'));
    expect(textarea.attributes('aria-invalid')).toBe('true');
    expect(textarea.attributes('aria-describedby')).toContain(error.attributes('id'));
  });

  it('supports auto resize in a test DOM', async () => {
    const wrapper = mount(UiTextarea, {
      props: { modelValue: 'hello', autoResize: true },
    });
    await wrapper.setProps({ modelValue: 'hello\nworld' });
    expect(wrapper.get('textarea').attributes('data-auto-resize')).toBe('true');
  });
});
