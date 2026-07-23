import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import UiDialog from './UiDialog.vue';

describe('UiDialog', () => {
  it('keeps the dialog mounted and lets Transition control visibility through v-show', async () => {
    const wrapper = mount(UiDialog, {
      props: { modelValue: false, teleport: false, forceMotion: true },
    });

    expect(wrapper.get('.cui-dialog__backdrop').attributes('style')).toContain('display: none');
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.get('.cui-dialog__backdrop').attributes('style')).not.toContain('display: none');
  });
  it('renders semantics, layout sections and slots inline', () => {
    const wrapper = mount(UiDialog, {
      props: { modelValue: true, title: 'Title', description: 'Desc', size: 'lg', teleport: false },
      slots: { default: '<p>Body</p>', footer: 'Footer' },
    });

    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe('true');
    expect(wrapper.get('[role="dialog"]').attributes('data-size')).toBe('lg');
    expect(wrapper.get('.cui-dialog__heading').text()).toContain('Title');
    expect(wrapper.get('.cui-dialog__heading').text()).toContain('Desc');
    expect(wrapper.get('.cui-dialog__body').text()).toBe('Body');
    expect(wrapper.get('.cui-dialog__footer').text()).toBe('Footer');
    expect(wrapper.find('.cui-dialog__close svg').exists()).toBe(true);
  });

  it('renders a description without requiring a title', () => {
    const wrapper = mount(UiDialog, {
      props: { modelValue: true, description: 'Description only', teleport: false, showClose: false },
    });

    expect(wrapper.get('.cui-dialog__description').text()).toBe('Description only');
    expect(wrapper.get('[role="dialog"]').attributes('aria-describedby')).toBeTruthy();
    expect(wrapper.get('[role="dialog"]').attributes('aria-labelledby')).toBeUndefined();
    expect(wrapper.find('.cui-dialog__title').exists()).toBe(false);
  });
  it('uses built-in animation variants and accepts a custom transition name', async () => {
    const wrapper = mount(UiDialog, {
      props: { modelValue: true, teleport: false, animation: 'slide-up', forceMotion: true },
    });

    expect(wrapper.get('[role="dialog"]').attributes('data-animation')).toBe('slide-up');
    expect(wrapper.get('.cui-dialog__backdrop').attributes('data-force-motion')).toBe('true');
    await wrapper.setProps({ transitionName: 'product-dialog' });
    expect(wrapper.props('transitionName')).toBe('product-dialog');

    const disabled = mount(UiDialog, {
      props: { modelValue: true, teleport: false, animation: 'none' },
    });
    expect(disabled.get('[role="dialog"]').attributes('data-animation')).toBe('none');
  });

  it.each([
    ['button', '.cui-dialog__close'],
    ['backdrop', '.cui-dialog__backdrop'],
  ] as const)('closes by %s', async (reason, selector) => {
    const wrapper = mount(UiDialog, { props: { modelValue: true, teleport: false } });

    await wrapper.get(selector).trigger(reason === 'backdrop' ? 'mousedown' : 'click');
    expect(wrapper.emitted('close')?.[0]).toEqual([reason]);
  });

  it('closes by Escape and respects guards', async () => {
    const wrapper = mount(UiDialog, { props: { modelValue: true, teleport: false } });
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('close')?.[0]).toEqual(['escape']);

    const guarded = mount(UiDialog, {
      props: {
        modelValue: true,
        teleport: false,
        closeOnEscape: false,
        closeOnBackdrop: false,
        showClose: false,
      },
    });
    await guarded.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    await guarded.get('.cui-dialog__backdrop').trigger('mousedown');
    expect(guarded.emitted('close')).toBeUndefined();
    expect(guarded.find('.cui-dialog__close').exists()).toBe(false);
  });

  it('traps focus in both directions and handles no controls', async () => {
    const wrapper = mount(UiDialog, {
      attachTo: document.body,
      props: { modelValue: true, teleport: false, showClose: false },
      slots: { default: '<button data-a>A</button><button data-b>B</button>' },
    });
    await nextTick();
    const first = wrapper.get<HTMLButtonElement>('[data-a]');
    const last = wrapper.get<HTMLButtonElement>('[data-b]');
    last.element.focus();
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Tab' });
    expect(document.activeElement).toBe(first.element);
    first.element.focus();
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last.element);
    wrapper.unmount();

    const empty = mount(UiDialog, { props: { modelValue: true, teleport: false, showClose: false } });
    await empty.get('[role="dialog"]').trigger('keydown', { key: 'Tab' });
  });

  it('restores focus and uses the title slot and custom label', async () => {
    const before = document.createElement('button');
    document.body.append(before);
    before.focus();
    const wrapper = mount(UiDialog, {
      attachTo: document.body,
      props: { modelValue: false, teleport: false, closeLabel: 'Закрыть' },
      slots: { title: 'Slot' },
    });

    await wrapper.setProps({ modelValue: true });
    expect(wrapper.get('.cui-dialog__close').attributes('aria-label')).toBe('Закрыть');
    await wrapper.setProps({ modelValue: false });
    expect(document.activeElement).toBe(before);
    wrapper.unmount();
    before.remove();
  });
});