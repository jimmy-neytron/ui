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


describe('UiTextarea public contract', () => {
  it('forwards supported props and native attributes', () => {
    const wrapper = mount(UiTextarea, {
      props: {
        modelValue: 'Text', placeholder: 'Write', rows: 8, maxlength: 20,
        disabled: true, readonly: true, required: true, name: 'bio',
      },
      attrs: { id: 'bio-id', 'data-testid': 'bio' },
    });
    const textarea = wrapper.get('textarea');
    expect(textarea.attributes()).toEqual(expect.objectContaining({
      id: 'bio-id', placeholder: 'Write', rows: '8', maxlength: '20',
      disabled: '', readonly: '', required: '', name: 'bio', 'data-testid': 'bio',
    }));
  });

  it('emits focus, blur, and native change events', async () => {
    const wrapper = mount(UiTextarea);
    await wrapper.get('textarea').trigger('focus');
    await wrapper.get('textarea').trigger('change');
    await wrapper.get('textarea').trigger('blur');
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('combines hint and count with consumer aria-describedby', () => {
    const wrapper = mount(UiTextarea, {
      props: { modelValue: 'abc', hint: 'Be concise', showCount: true },
      attrs: { 'aria-describedby': 'external' },
    });
    const ids = wrapper.get('textarea').attributes('aria-describedby')?.split(' ') ?? [];
    expect(ids).toContain('external');
    expect(ids).toContain(wrapper.get('.cui-field__message').attributes('id'));
    expect(ids).toContain(wrapper.get('.cui-textarea__count').attributes('id'));
    expect(wrapper.get('.cui-textarea__count').text()).toBe('3');
  });

  it('renders a required marker and error takes precedence over hint', () => {
    const wrapper = mount(UiTextarea, {
      props: { label: 'Bio', required: true, hint: 'Hint', error: 'Error' },
    });
    expect(wrapper.get('.cui-field__required').attributes('aria-hidden')).toBe('true');
    expect(wrapper.text()).toContain('Error');
    expect(wrapper.text()).not.toContain('Hint');
  });

  it('resets an auto-resized height when autoResize is disabled', async () => {
    const wrapper = mount(UiTextarea, { props: { modelValue: 'a', autoResize: true } });
    const element = wrapper.get<HTMLTextAreaElement>('textarea').element;
    element.style.height = '120px';
    await wrapper.setProps({ autoResize: false });
    await wrapper.vm.$nextTick();
    expect(element.style.height).toBe('');
  });

  it('uses no manual resize handle while auto resizing', () => {
    const wrapper = mount(UiTextarea, { props: { autoResize: true } });
    expect(wrapper.get('textarea').attributes('style')).toContain('resize: none');
  });
});
