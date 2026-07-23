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
