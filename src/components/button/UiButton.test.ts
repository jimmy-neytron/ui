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


describe('UiButton public contract', () => {
  it('renders native defaults, block state, label, and native attributes', () => {
    const wrapper = mount(UiButton, {
      props: { block: true, ariaLabel: 'Save document' },
      attrs: { name: 'save', class: 'custom-button' },
    });
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.attributes('aria-label')).toBe('Save document');
    expect(wrapper.attributes('name')).toBe('save');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['cui-button', 'cui-button--block', 'custom-button']));
  });

  it('renders leading and trailing slots', () => {
    const wrapper = mount(UiButton, {
      slots: {
        leading: '<span data-leading>+</span>',
        default: 'Create',
        trailing: '<span data-trailing>→</span>',
      },
    });
    expect(wrapper.find('[data-leading]').exists()).toBe(true);
    expect(wrapper.find('[data-trailing]').exists()).toBe(true);
  });

  it('renders default and custom loaders with hidden content', () => {
    const fallback = mount(UiButton, { props: { loading: true }, slots: { default: 'Save' } });
    const custom = mount(UiButton, {
      props: { loading: true },
      slots: { loader: '<span data-loader>Wait</span>' },
    });
    expect(fallback.find('.cui-spinner').exists()).toBe(true);
    expect(fallback.get('.cui-button__content').attributes('aria-hidden')).toBe('true');
    expect(custom.get('[data-loader]').text()).toBe('Wait');
  });

  it.each([{ disabled: true }, { loading: true }])(
    'cancels programmatic click for unavailable state %o',
    (props) => {
      const wrapper = mount(UiButton, { props: props as { disabled?: boolean; loading?: boolean } });
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      wrapper.element.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      expect(wrapper.emitted('click')).toBeUndefined();
    },
  );

  it('supports native submit type', () => {
    expect(mount(UiButton, { props: { type: 'submit' } }).attributes('type')).toBe('submit');
  });
});
