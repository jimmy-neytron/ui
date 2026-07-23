import { mount } from '@vue/test-utils';
import UiTooltip from './UiTooltip.vue';

function rect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe('UiTooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens after delay and links the trigger', async () => {
    const wrapper = mount(UiTooltip, {
      props: { content: 'Help', delay: 100, placement: 'bottom', teleport: false },
      slots: { trigger: '<button>?</button>' },
    });

    await wrapper.trigger('mouseenter');
    vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[role="tooltip"]').text()).toBe('Help');
    expect(wrapper.get('[role="tooltip"]').attributes('data-placement')).toBe('bottom');
    expect(wrapper.get('.cui-overlay-trigger').attributes('aria-describedby')).toBeTruthy();

    await wrapper.trigger('mouseleave');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('repositions a teleported tooltip when its scroll parent moves the trigger', async () => {
    const scrollHost = document.createElement('div');
    scrollHost.style.overflow = 'auto';
    const mountPoint = document.createElement('div');
    scrollHost.append(mountPoint);
    document.body.append(scrollHost);
    let anchorTop = 120;
    const wrapper = mount(UiTooltip, {
      attachTo: mountPoint,
      props: { content: 'Following', delay: 0, placement: 'bottom' },
      slots: { trigger: '<button>Trigger</button>' },
    });
    wrapper.element.getBoundingClientRect = () => rect(anchorTop, 80, 40, 20);

    await wrapper.trigger('mouseenter');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const floating = document.body.querySelector<HTMLElement>('[role="tooltip"]')!;
    floating.getBoundingClientRect = () => rect(0, 0, 100, 24);
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();
    expect(floating.style.top).toBe('148px');

    anchorTop = 40;
    scrollHost.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();
    expect(floating.style.top).toBe('68px');

    wrapper.unmount();
    scrollHost.remove();
  });

  it('flips from top to bottom near the viewport edge', async () => {
    const wrapper = mount(UiTooltip, {
      props: { content: 'Adaptive', delay: 0, placement: 'top', teleport: false },
      slots: { trigger: '<button>Trigger</button>' },
    });
    wrapper.element.getBoundingClientRect = () => rect(2, 80, 40, 20);

    await wrapper.trigger('mouseenter');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const floating = wrapper.get<HTMLElement>('[role="tooltip"]');
    floating.element.getBoundingClientRect = () => rect(0, 0, 100, 40);
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();

    expect(floating.attributes('data-placement')).toBe('bottom');
    expect(floating.attributes('style')).toContain('top: 30px');
    wrapper.unmount();
  });

  it('flips from left to right near the horizontal viewport edge', async () => {
    const wrapper = mount(UiTooltip, {
      props: { content: 'Horizontal', delay: 0, placement: 'left', teleport: false },
      slots: { trigger: '<button>Trigger</button>' },
    });
    wrapper.element.getBoundingClientRect = () => rect(40, 2, 20, 20);

    await wrapper.trigger('mouseenter');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const floating = wrapper.get<HTMLElement>('[role="tooltip"]');
    floating.element.getBoundingClientRect = () => rect(0, 0, 80, 24);
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();

    expect(floating.attributes('data-placement')).toBe('right');
    expect(floating.attributes('style')).toContain('left: 30px');
    wrapper.unmount();
  });

  it('keeps the preferred side when automatic placement is disabled', async () => {
    const wrapper = mount(UiTooltip, {
      props: { content: 'Fixed', delay: 0, placement: 'top', autoPlacement: false, teleport: false },
      slots: { trigger: 'X' },
    });
    await wrapper.trigger('focusin');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[role="tooltip"]').attributes('data-placement')).toBe('top');
    await wrapper.setProps({ placement: 'bottom' });
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[role="tooltip"]').attributes('data-placement')).toBe('bottom');
    wrapper.unmount();
  });

  it('observes trigger and tooltip size and disconnects the observer on unmount', async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      observe = observe;
      disconnect = disconnect;
    });
    const wrapper = mount(UiTooltip, {
      props: { content: 'Observed', delay: 0, teleport: false },
      slots: { trigger: 'X' },
    });

    await wrapper.trigger('mouseenter');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(observe).toHaveBeenCalledTimes(2);

    wrapper.unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });
  it('supports focus, slot and Escape', async () => {
    const wrapper = mount(UiTooltip, {
      props: { delay: 0, teleport: false },
      slots: { trigger: 'X', default: 'Slot' },
    });
    await wrapper.trigger('focusin');
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[role="tooltip"]').text()).toBe('Slot');
    await wrapper.trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('does not open while disabled and cancels a pending timer', async () => {
    const wrapper = mount(UiTooltip, {
      props: { disabled: true, delay: 1, teleport: false },
      slots: { trigger: 'X' },
    });
    await wrapper.trigger('mouseenter');
    vi.runAllTimers();
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    wrapper.unmount();
  });
});