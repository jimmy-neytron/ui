import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UiConfigProvider from '../config-provider/UiConfigProvider.vue';
import UiToast from './UiToast.vue';
import UiToastProvider from './UiToastProvider.vue';
import { useToast } from './toast';

describe('UiToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders content and closes manually', async () => {
    const wrapper = mount(UiToast, { props: { title: 'Saved', description: 'Changes applied', tone: 'success', duration: 0 } });
    expect(wrapper.attributes('role')).toBe('status'); expect(wrapper.attributes('data-tone')).toBe('success'); expect(wrapper.text()).toContain('Changes applied');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]); expect(wrapper.emitted('close')).toEqual([[]]);
  });

  it('supports slots, custom labels and hidden close button', () => {
    const slotted = mount(UiToast, { props: { closeLabel: 'Close notification', duration: 0 }, slots: { default: 'Slot body' } });
    expect(slotted.text()).toContain('Slot body'); expect(slotted.get('button').attributes('aria-label')).toBe('Close notification');
    expect(mount(UiToast, { props: { dismissible: false, duration: 0 } }).find('button').exists()).toBe(false);
  });

  it('automatically closes and pauses on hover', async () => {
    const wrapper = mount(UiToast, { props: { duration: 1000 } });
    vi.advanceTimersByTime(500); await wrapper.trigger('mouseenter'); vi.advanceTimersByTime(1000); expect(wrapper.emitted('close')).toBeUndefined();
    await wrapper.trigger('mouseleave'); vi.advanceTimersByTime(1000); expect(wrapper.emitted('close')).toEqual([[]]);
  });

  it('restarts when duration changes', async () => {
    const wrapper = mount(UiToast, { props: { duration: 2000 } });
    vi.advanceTimersByTime(1000); await wrapper.setProps({ duration: 500 }); vi.advanceTimersByTime(500);
    expect(wrapper.emitted('close')).toEqual([[]]);
  });

  it('honors localized close label', () => {
    const wrapper = mount(UiConfigProvider, { props: { locale: { close: 'Close localized' } }, slots: { default: defineComponent({ render: () => h(UiToast, { duration: 0 }) }) } });
    expect(wrapper.get('button').attributes('aria-label')).toBe('Close localized');
  });
});

describe('UiToastProvider', () => {
  it('manages queue through useToast', async () => {
    let api: ReturnType<typeof useToast> | undefined;
    const Consumer = defineComponent({ setup() { api = useToast(); return () => h('button', { onClick: () => api!.push({ title: 'Created', duration: 0 }) }, 'Create'); } });
    const wrapper = mount(UiToastProvider, { attachTo: document.body, slots: { default: Consumer } });
    await wrapper.get('button').trigger('click'); await nextTick(); expect(document.body.textContent).toContain('Created');
    const id = api!.push({ id: 'custom', title: 'Second', duration: 0 }); expect(id).toBe('custom'); await nextTick(); expect(document.body.textContent).toContain('Second');
    api!.remove(id); await nextTick(); expect(document.body.textContent).not.toContain('Second');
    api!.clear(); await nextTick(); expect(document.body.textContent).not.toContain('Created'); wrapper.unmount();
  });

  it('throws outside provider', () => {
    const Consumer = defineComponent({ setup: () => useToast(), template: '<div />' });
    expect(() => mount(Consumer)).toThrow('UiToastProvider');
  });
});