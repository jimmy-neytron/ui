import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiDropdownMenu from './UiDropdownMenu.vue';
import type { UiDropdownMenuItem } from './UiDropdownMenu.types';

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete', danger: true },
  { label: 'Disabled', value: 'disabled', disabled: true },
  { label: 'Docs', value: 'docs', href: '/docs' },
];

describe('UiDropdownMenu', () => {
  it('opens, selects and emits lifecycle events', async () => {
    const wrapper = mount(UiDropdownMenu, { props: { items }, slots: { trigger: '<button>Actions</button>' } });
    await wrapper.get('.cui-overlay-trigger').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(wrapper.emitted('open')).toEqual([[]]);
    await wrapper.setProps({ modelValue: true });
    await wrapper.findAll('[role="menuitem"]')[0]!.trigger('click');
    expect(wrapper.emitted('select')).toEqual([['edit']]);
    expect(wrapper.emitted('close')).toEqual([[]]);
  });

  it('supports links, disabled, danger, placement and custom items', async () => {
    const wrapper = mount(UiDropdownMenu, {
      props: { items, modelValue: true, placement: 'top' }, slots: { trigger: '<button>Actions</button>', item: ({ item }: { item: UiDropdownMenuItem }) => `Item: ${item.label}` },
    });
    const menuItems = wrapper.findAll('[role="menuitem"]');
    expect(wrapper.get('[role="menu"]').attributes('data-placement')).toBe('top');
    expect(menuItems[0]!.text()).toBe('Item: Edit');
    expect(menuItems[1]!.attributes('data-danger')).toBe('true');
    expect(menuItems[2]!.attributes('disabled')).toBeDefined();
    expect(menuItems[3]!.attributes('href')).toBe('/docs');
    await menuItems[2]!.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('navigates enabled items and closes with Escape', async () => {
    const wrapper = mount(UiDropdownMenu, { attachTo: document.body, props: { items, modelValue: true }, slots: { trigger: '<button>Actions</button>' } });
    const menuItems = wrapper.findAll<HTMLElement>('[role="menuitem"]');
    await menuItems[0]!.trigger('keydown', { key: 'ArrowDown' }); expect(document.activeElement).toBe(menuItems[1]!.element);
    await menuItems[1]!.trigger('keydown', { key: 'End' }); expect(document.activeElement).toBe(menuItems[3]!.element);
    await menuItems[3]!.trigger('keydown', { key: 'Home' }); expect(document.activeElement).toBe(menuItems[0]!.element);
    await menuItems[0]!.trigger('keydown', { key: 'ArrowUp' }); expect(document.activeElement).toBe(menuItems[3]!.element);
    await menuItems[3]!.trigger('keydown', { key: 'Escape' }); expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
    wrapper.unmount();
  });

  it('respects disabled and opens with ArrowDown', async () => {
    const wrapper = mount(UiDropdownMenu, { props: { items, disabled: true }, slots: { trigger: '<button>Actions</button>' } });
    await wrapper.get('.cui-overlay-trigger').trigger('click'); expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await wrapper.setProps({ disabled: false });
    await wrapper.get('.cui-overlay-trigger').trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });
});