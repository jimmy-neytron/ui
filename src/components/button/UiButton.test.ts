import { mount } from '@vue/test-utils';
import UiButton from './UiButton.vue';

describe('UiButton', () => {
  it('renders content and visual props', () => {
    const wrapper = mount(UiButton, {
      props: { variant: 'secondary', size: 'lg' },
      slots: { default: 'Save' },
    });

    expect(wrapper.text()).toContain('Save');
    expect(wrapper.attributes('data-variant')).toBe('secondary');
    expect(wrapper.attributes('data-size')).toBe('lg');
  });

  it('emits click in the normal state', async () => {
    const wrapper = mount(UiButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click while disabled', async () => {
    const wrapper = mount(UiButton, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('does not emit click while loading and exposes busy state', async () => {
    const wrapper = mount(UiButton, { props: { loading: true } });
    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
