import { mount } from '@vue/test-utils';
import UiAlert from './UiAlert.vue';

describe('UiAlert', () => {
  it('renders accessible defaults and message content', () => {
    const wrapper = mount(UiAlert, { slots: { default: 'Saved' } });
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('data-tone')).toBe('info');
    expect(wrapper.attributes('data-variant')).toBe('soft');
    expect(wrapper.get('.cui-alert__message').text()).toBe('Saved');
  });

  it.each([
    ['info', 'soft'],
    ['success', 'outline'],
    ['warning', 'soft'],
    ['danger', 'outline'],
  ] as const)('renders %s tone with %s variant', (tone, variant) => {
    const wrapper = mount(UiAlert, { props: { tone, variant } });
    expect(wrapper.attributes('data-tone')).toBe(tone);
    expect(wrapper.attributes('data-variant')).toBe(variant);
  });

  it('renders title prop and named title slot', () => {
    const fromProp = mount(UiAlert, { props: { title: 'Notice' } });
    const fromSlot = mount(UiAlert, {
      props: { title: 'Ignored' },
      slots: { title: 'Slot title' },
    });
    expect(fromProp.get('.cui-alert__title').text()).toBe('Notice');
    expect(fromSlot.get('.cui-alert__title').text()).toBe('Slot title');
  });

  it('does not render optional regions without content', () => {
    const wrapper = mount(UiAlert);
    expect(wrapper.find('.cui-alert__title').exists()).toBe(false);
    expect(wrapper.find('.cui-alert__icon').exists()).toBe(false);
    expect(wrapper.find('.cui-alert__actions').exists()).toBe(false);
    expect(wrapper.find('.cui-alert__dismiss').exists()).toBe(false);
  });

  it('renders icon and actions slots', () => {
    const wrapper = mount(UiAlert, {
      slots: {
        icon: '<span data-icon>!</span>',
        actions: '<button data-action>Undo</button>',
      },
    });
    expect(wrapper.get('[data-icon]').text()).toBe('!');
    expect(wrapper.get('[data-action]').text()).toBe('Undo');
    expect(wrapper.get('.cui-alert__icon').attributes('aria-hidden')).toBe('true');
  });

  it('emits the native event when dismissed', async () => {
    const wrapper = mount(UiAlert, { props: { dismissible: true } });
    await wrapper.get('.cui-alert__dismiss').trigger('click');
    const event = wrapper.emitted('dismiss')?.[0]?.[0];
    expect(event).toBeInstanceOf(MouseEvent);
  });

  it('supports custom dismiss label and close slot', () => {
    const wrapper = mount(UiAlert, {
      props: { dismissible: true, dismissLabel: 'Закрыть', role: 'alert' },
      slots: { close: '<span data-close>close</span>' },
    });
    expect(wrapper.attributes('role')).toBe('alert');
    expect(wrapper.get('button').attributes('aria-label')).toBe('Закрыть');
    expect(wrapper.get('[data-close]').text()).toBe('close');
  });

  it('forwards native attributes and merges classes', () => {
    const wrapper = mount(UiAlert, {
      attrs: { id: 'network-alert', class: 'custom-alert', 'data-testid': 'alert' },
    });
    expect(wrapper.attributes('id')).toBe('network-alert');
    expect(wrapper.classes()).toContain('cui-alert');
    expect(wrapper.classes()).toContain('custom-alert');
    expect(wrapper.attributes('data-testid')).toBe('alert');
  });
});
