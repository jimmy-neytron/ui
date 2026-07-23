import { mount } from '@vue/test-utils';
import UiAccordion from './UiAccordion.vue';

const items = [
  { value: 'a', title: 'A', content: 'Alpha' },
  { value: 'b', title: 'B', content: 'Beta' },
  { value: 'c', title: 'C', disabled: true },
];

describe('UiAccordion', () => {
  it('renders an accessible single state with an SVG icon and toggles it', async () => {
    const wrapper = mount(UiAccordion, { props: { items, modelValue: 'a' } });
    const trigger = wrapper.get('[aria-expanded="true"]');

    expect(trigger.attributes('aria-controls')).toBeTruthy();
    expect(trigger.find('.cui-accordion__icon svg').exists()).toBe(true);
    expect(wrapper.get('[role="region"]').text()).toBe('Alpha');

    await trigger.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
  });

  it('opens another item when not collapsible', async () => {
    const wrapper = mount(UiAccordion, { props: { items, modelValue: 'a', collapsible: false } });

    await wrapper.findAll('button')[0]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a']);

    await wrapper.findAll('button')[1]!.trigger('click');
    expect(wrapper.emitted('change')?.[1]).toEqual(['b']);
  });

  it('adds and removes values in multiple mode without mutation', async () => {
    const initial = ['a'];
    const wrapper = mount(UiAccordion, { props: { items, modelValue: initial, multiple: true } });

    await wrapper.findAll('button')[1]!.trigger('click');
    await wrapper.findAll('button')[0]!.trigger('click');

    expect(initial).toEqual(['a']);
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'b']], [[]]]);
  });

  it('blocks disabled items and renders content slots', async () => {
    const wrapper = mount(UiAccordion, {
      props: { items, modelValue: null },
      slots: {
        title: '<template #default="{ item }">T{{ item.title }}</template>',
        item: '<template #default="{ item }">P{{ item.content }}</template>',
      },
    });

    await wrapper.findAll('button')[2]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.find('.cui-accordion__item[data-disabled="true"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('TA');
  });

  it('allows replacing the default icon through the icon slot', () => {
    const wrapper = mount(UiAccordion, {
      props: { items, modelValue: 'a' },
      slots: { icon: '<template #default="{ open }"><span data-icon>{{ open ? "open" : "closed" }}</span></template>' },
    });

    expect(wrapper.get('[data-icon]').text()).toBe('open');
    expect(wrapper.find('.cui-accordion__icon svg').exists()).toBe(false);
  });
});