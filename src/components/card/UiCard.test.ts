import { mount } from '@vue/test-utils';
import UiCard from './UiCard.vue';

describe('UiCard', () => {
  it('renders semantic defaults', () => {
    const wrapper = mount(UiCard, { slots: { default: 'Content' } });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('data-variant')).toBe('outline');
    expect(wrapper.attributes('data-padding')).toBe('md');
    expect(wrapper.get('.cui-card__body').text()).toBe('Content');
  });

  it.each(['elevated', 'outline', 'filled'] as const)('renders %s variant', (variant) => {
    expect(mount(UiCard, { props: { variant } }).attributes('data-variant')).toBe(variant);
  });

  it.each(['none', 'sm', 'md', 'lg'] as const)('renders %s padding', (padding) => {
    expect(mount(UiCard, { props: { padding } }).attributes('data-padding')).toBe(padding);
  });

  it('supports a custom semantic element', () => {
    const wrapper = mount(UiCard, { props: { as: 'article' } });
    expect(wrapper.element.tagName).toBe('ARTICLE');
  });

  it('renders all named regions in document order', () => {
    const wrapper = mount(UiCard, {
      slots: {
        media: '<div data-region="media" />',
        header: '<div data-region="header" />',
        default: '<div data-region="body" />',
        footer: '<div data-region="footer" />',
      },
    });
    expect(wrapper.findAll('[data-region]').map((node) => node.attributes('data-region')))
      .toEqual(['media', 'header', 'body', 'footer']);
  });

  it('omits unused regions', () => {
    const wrapper = mount(UiCard);
    expect(wrapper.find('.cui-card__media').exists()).toBe(false);
    expect(wrapper.find('.cui-card__header').exists()).toBe(false);
    expect(wrapper.find('.cui-card__body').exists()).toBe(false);
    expect(wrapper.find('.cui-card__footer').exists()).toBe(false);
  });

  it('forwards native attributes and merges classes', () => {
    const wrapper = mount(UiCard, {
      attrs: { id: 'profile', class: 'custom-card', 'aria-label': 'Profile' },
    });
    expect(wrapper.attributes('id')).toBe('profile');
    expect(wrapper.attributes('aria-label')).toBe('Profile');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['cui-card', 'custom-card']));
  });
});
