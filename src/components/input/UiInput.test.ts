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


describe('UiInput public contract', () => {
  it('normalizes a non-empty number input to number and keeps empty as string', async () => {
    const wrapper = mount(UiInput, { props: { type: 'number', modelValue: '' } });
    await wrapper.get('input').setValue('42');
    await wrapper.get('input').setValue('');
    expect(wrapper.emitted('update:modelValue')?.map((entry) => entry[0])).toEqual([42, '']);
  });

  it('forwards all supported native props', () => {
    const wrapper = mount(UiInput, {
      props: {
        modelValue: '5', placeholder: 'Amount', disabled: true, readonly: true,
        required: true, name: 'amount', autocomplete: 'off', inputmode: 'numeric',
        min: 1, max: 10, step: 2, maxlength: 4, pattern: '[0-9]+', size: 'lg',
      },
      attrs: { id: 'amount-id' },
    });
    const input = wrapper.get('input');
    expect(input.attributes()).toEqual(expect.objectContaining({
      id: 'amount-id', placeholder: 'Amount', disabled: '', readonly: '', required: '',
      name: 'amount', autocomplete: 'off', inputmode: 'numeric', min: '1', max: '10',
      step: '2', maxlength: '4', pattern: '[0-9]+',
    }));
    expect(wrapper.attributes('data-size')).toBe('lg');
  });

  it('emits focus, blur, and native change events', async () => {
    const wrapper = mount(UiInput);
    await wrapper.get('input').trigger('focus');
    await wrapper.get('input').trigger('change');
    await wrapper.get('input').trigger('blur');
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });

  it('renders required marker plus prefix and suffix slots', () => {
    const wrapper = mount(UiInput, {
      props: { label: 'Price', required: true },
      slots: { prefix: '<span data-prefix>$</span>', suffix: '<span data-suffix>USD</span>' },
    });
    expect(wrapper.get('.cui-field__required').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('[data-prefix]').text()).toBe('$');
    expect(wrapper.get('[data-suffix]').text()).toBe('USD');
  });

  it('combines consumer aria-describedby and gives error precedence over hint', () => {
    const wrapper = mount(UiInput, {
      props: { hint: 'Hint', error: 'Error' },
      attrs: { 'aria-describedby': 'external-description' },
    });
    const ids = wrapper.get('input').attributes('aria-describedby')?.split(' ');
    expect(ids).toContain('external-description');
    expect(ids).toContain(wrapper.get('.cui-field__message--error').attributes('id'));
    expect(wrapper.text()).not.toContain('Hint');
  });

  it('does not render clear action for an empty value', () => {
    expect(mount(UiInput, {
      props: { modelValue: '', clearable: true },
    }).find('.cui-input__clear').exists()).toBe(false);
  });

  it.each([{ disabled: true }, { readonly: true }])(
    'does not clear in protected state %o',
    (state) => {
      const wrapper = mount(UiInput, {
        props: { modelValue: 'protected', clearable: true, ...state },
      });
      wrapper.get('.cui-input__clear').element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.emitted('clear')).toBeUndefined();
    },
  );

  it('restores focus after clearing', async () => {
    const wrapper = mount(UiInput, {
      attachTo: document.body,
      props: { modelValue: 'text', clearable: true },
    });
    await wrapper.get('.cui-input__clear').trigger('click');
    expect(document.activeElement).toBe(wrapper.get('input').element);
    wrapper.unmount();
  });
});
