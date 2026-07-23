import { mount } from '@vue/test-utils';
import UiRadio from './UiRadio.vue';

describe('UiRadio', () => {
  it('checks itself when values match', () => {
    const wrapper = mount(UiRadio, {
      props: { modelValue: 'pro', value: 'pro', label: 'Pro' },
    });
    expect((wrapper.get('input').element as HTMLInputElement).checked).toBe(true);
  });

  it('emits its typed value when selected', async () => {
    const wrapper = mount(UiRadio, {
      props: { modelValue: null, value: 2, name: 'plan' },
    });
    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('connects description through aria-describedby', () => {
    const wrapper = mount(UiRadio, {
      props: { value: 'basic', description: 'For personal use' },
    });
    const description = wrapper.get('.cui-choice__description');
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(description.attributes('id'));
  });
});


describe('UiRadio public contract', () => {
  it('renders unchecked state and forwards form props, attrs, and size', () => {
    const wrapper = mount(UiRadio, {
      props: { modelValue: 'free', value: 'pro', required: true, disabled: true, name: 'plan', size: 'lg' },
      attrs: { id: 'plan-pro', 'data-testid': 'radio' },
    });
    const input = wrapper.get<HTMLInputElement>('input');
    expect(input.element.checked).toBe(false);
    expect(input.attributes()).toEqual(expect.objectContaining({
      id: 'plan-pro', required: '', disabled: '', name: 'plan', value: 'pro',
      'data-testid': 'radio',
    }));
    expect(wrapper.attributes('data-size')).toBe('lg');
    expect(wrapper.attributes('data-disabled')).toBe('true');
  });

  it('renders default slot instead of label prop', () => {
    const wrapper = mount(UiRadio, {
      props: { value: 1, label: 'Ignored' },
      slots: { default: 'Team plan' },
    });
    expect(wrapper.get('.cui-choice__label').text()).toBe('Team plan');
  });

  it('does not emit through native interaction while disabled', async () => {
    const wrapper = mount(UiRadio, { props: { value: 'x', disabled: true } });
    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('omits optional content when no label, description, or slot exists', () => {
    expect(mount(UiRadio, { props: { value: 'x' } }).find('.cui-choice__content').exists())
      .toBe(false);
  });
});
