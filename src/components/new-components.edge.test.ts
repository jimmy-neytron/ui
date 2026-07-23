import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiAccordion from './accordion/UiAccordion.vue';
import UiAvatar from './avatar/UiAvatar.vue';
import UiDialog from './dialog/UiDialog.vue';
import UiDropdownMenu from './dropdown-menu/UiDropdownMenu.vue';
import UiPagination from './pagination/UiPagination.vue';
import UiSkeleton from './skeleton/UiSkeleton.vue';
import UiToastProvider from './toast/UiToastProvider.vue';
import { useToast } from './toast/toast';

describe('0.3.0 component edge cases', () => {
  it('covers accordion non-array multiple state and non-collapsible current item', async () => {
    const items = [{ value: 'a', title: 'A' }, { value: 'b', title: 'B' }];
    const multiple = mount(UiAccordion, { props: { items, multiple: true, modelValue: null } });
    await multiple.findAll('button')[1]!.trigger('click');
    expect(multiple.emitted('change')?.[0]).toEqual([['b']]);
    const fixed = mount(UiAccordion, { props: { items, modelValue: 'a', collapsible: false } });
    await fixed.get('button').trigger('click');
    expect(fixed.emitted('change')?.[0]).toEqual(['a']);
  });

  it('covers empty avatar fallback branches', () => {
    expect(mount(UiAvatar).get('.cui-avatar__fallback').text()).toBe('');
    expect(mount(UiAvatar, { props: { name: ' Prince ' } }).text()).toContain('P');
    expect(mount(UiAvatar, { props: { name: '   ' } }).text()).toBe('');
  });

  it('focuses dialog itself without controls and ignores inner backdrop events', async () => {
    const wrapper = mount(UiDialog, { attachTo: document.body, props: { modelValue: true, teleport: false, showClose: false } });
    await nextTick();
    const dialog = wrapper.get<HTMLElement>('[role="dialog"]');
    await dialog.trigger('keydown', { key: 'Tab' });
    expect(document.activeElement).toBe(dialog.element);
    await dialog.trigger('mousedown');
    expect(wrapper.emitted('close')).toBeUndefined();
    await dialog.trigger('keydown', { key: 'ArrowDown' });
    wrapper.unmount();
  });

  it('prefers autofocus in dialog', async () => {
    const wrapper = mount(UiDialog, { attachTo: document.body, props: { modelValue: true, teleport: false, showClose: false }, slots: { default: '<button autofocus data-auto>Auto</button>' } });
    await nextTick();
    expect(document.activeElement).toBe(wrapper.get('[data-auto]').element);
    wrapper.unmount();
  });

  it('covers disabled dropdown links and outside close', async () => {
    const items = [{ value: 'locked', label: 'Locked', href: '/locked', disabled: true }];
    const wrapper = mount(UiDropdownMenu, { attachTo: document.body, props: { modelValue: true, items }, slots: { trigger: '<button>Menu</button>' } });
    const link = wrapper.get('a');
    expect(link.attributes('href')).toBeUndefined();
    await link.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(wrapper.emitted('close')).toEqual([[]]);
    wrapper.unmount();
  });

  it('navigates pagination with previous and next controls', async () => {
    const wrapper = mount(UiPagination, { props: { total: 100, modelValue: 5 } });
    const controls = wrapper.findAll('button');
    await controls[0]!.trigger('click');
    await controls.at(-1)!.trigger('click');
    expect(wrapper.emitted('change')).toEqual([[4], [6]]);
  });

  it('normalizes numeric and string skeleton dimensions', () => {
    const numeric = mount(UiSkeleton, { props: { width: 20, height: 30 } }).get('.cui-skeleton');
    expect(numeric.attributes('style')).toContain('20px');
    expect(numeric.attributes('style')).toContain('30px');
    const string = mount(UiSkeleton, { props: { width: '50%', height: '2rem', lines: 0 } });
    expect(string.findAll('.cui-skeleton')).toHaveLength(1);
    expect(string.get('.cui-skeleton').attributes('style')).toContain('50%');
  });

  it('removes a provider toast through its close event', async () => {
    const Consumer = defineComponent({ setup() { const toast = useToast(); toast.push({ title: 'Close me', duration: 0 }); return () => h('span', 'consumer'); } });
    const wrapper = mount(UiToastProvider, { attachTo: document.body, slots: { default: Consumer } });
    await nextTick();
    await document.body.querySelector<HTMLButtonElement>('.cui-toast__close')!.click();
    await nextTick();
    expect(document.body.textContent).not.toContain('Close me');
    wrapper.unmount();
  });
  it('covers internal guards that native disabled controls cannot dispatch', () => {
    const accordion = mount(UiAccordion, { props: { items: [{ value: 'a', title: 'A' }], modelValue: null } });
    (accordion.vm.$ as unknown as { setupState: { toggle: (value: string, disabled?: boolean) => void } }).setupState.toggle('a', true);
    expect(accordion.emitted('change')).toBeUndefined();

    const pagination = mount(UiPagination, { props: { total: 100, modelValue: 5 } });
    const select = (pagination.vm.$ as unknown as { setupState: { select: (page: number) => void } }).setupState.select;
    select(5);
    select(0);
    select(11);
    expect(pagination.emitted('change')).toBeUndefined();

    const menu = mount(UiDropdownMenu, { props: { modelValue: true, items: [{ value: 'a', label: 'A' }] }, slots: { trigger: '<button>Menu</button>' } });
    (menu.vm.$ as unknown as { setupState: { setOpen: (value: boolean) => void } }).setupState.setOpen(true);
    expect(menu.emitted('open')).toBeUndefined();
  });

  it('handles a dropdown with no enabled items', async () => {
    const wrapper = mount(UiDropdownMenu, { props: { modelValue: true, items: [{ value: 'x', label: 'X', disabled: true }] }, slots: { trigger: '<button>Menu</button>' } });
    await wrapper.get('[role="menuitem"]').trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.emitted('select')).toBeUndefined();
  });
  it('covers dropdown disabled selection and empty autofocus paths', async () => {
    const closed = mount(UiDropdownMenu, { props: { modelValue: false, items: [{ value: 'x', label: 'X', disabled: true }] }, slots: { trigger: '<button>Menu</button>' } });
    const state = (closed.vm.$ as unknown as { setupState: { setOpen: (value: boolean) => void; select: (item: { value: string; label: string; disabled?: boolean }) => void } }).setupState;
    state.select({ value: 'x', label: 'X', disabled: true });
    state.setOpen(true);
    await nextTick();
    expect(closed.emitted('select')).toBeUndefined();
    expect(closed.emitted('open')).toEqual([[]]);
  });

  it('handles a non-HTMLElement as the previously focused dialog node', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('tabindex', '0');
    document.body.append(svg);
    svg.focus();
    const wrapper = mount(UiDialog, { attachTo: document.body, props: { modelValue: true, teleport: false, showClose: false } });
    await nextTick();
    await wrapper.setProps({ modelValue: false });
    wrapper.unmount();
    svg.remove();
  });
});