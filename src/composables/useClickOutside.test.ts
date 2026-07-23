import { defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('calls the handler only for pointer events outside the target', async () => {
    const handler = vi.fn();
    const Host = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null);
        useClickOutside(target, handler);
        return { target };
      },
      template: '<div ref="target"><button>Inside</button></div>',
    });
    const wrapper = mount(Host, { attachTo: document.body });

    wrapper.get('button').element.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignores events while the target is unavailable', () => {
    const handler = vi.fn();
    const Host = defineComponent({
      setup() {
        useClickOutside(ref<HTMLElement | null>(null), handler);
      },
      template: '<div />',
    });
    const wrapper = mount(Host, { attachTo: document.body });
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
