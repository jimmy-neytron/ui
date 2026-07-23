import { mount } from '@vue/test-utils';
import UiBadge from './UiBadge.vue';

describe('UiBadge', () => {
  it('renders defaults and content', () => {
    const wrapper = mount(UiBadge, { slots: { default: 'New' } });

    expect(wrapper.text()).toBe('New');
    expect(wrapper.attributes('data-tone')).toBe('neutral');
    expect(wrapper.attributes('data-variant')).toBe('soft');
    expect(wrapper.attributes('data-size')).toBe('md');
  });

  it('renders tone, variant, dot, and native attributes', () => {
    const wrapper = mount(UiBadge, {
      props: { tone: 'success', variant: 'outline', dot: true },
      attrs: { title: 'Published' },
      slots: { default: 'Ready' },
    });

    expect(wrapper.attributes('data-tone')).toBe('success');
    expect(wrapper.attributes('data-variant')).toBe('outline');
    expect(wrapper.attributes('title')).toBe('Published');
    expect(wrapper.find('.cui-badge__dot').exists()).toBe(true);
  });

  it('renders the leading slot', () => {
    const wrapper = mount(UiBadge, {
      slots: { default: 'Verified', leading: '<span data-icon>✓</span>' },
    });
    expect(wrapper.find('[data-icon]').exists()).toBe(true);
  });
});
