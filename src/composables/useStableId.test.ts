import { defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useStableId } from './useStableId';

describe('useStableId', () => {
  it('uses and reactively updates an explicit id', async () => {
    const Host = defineComponent({
      setup() {
        const explicitId = ref<string | undefined>('explicit');
        const id = useStableId('field', explicitId);
        return { explicitId, id };
      },
      template: '<div :id="id" />',
    });
    const wrapper = mount(Host);
    expect(wrapper.attributes('id')).toBe('explicit');
    wrapper.vm.explicitId = 'updated';
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('id')).toBe('updated');
  });

  it('generates a stable prefixed id without an explicit getter', async () => {
    const Host = defineComponent({
      setup() {
        return { id: useStableId('field') };
      },
      template: '<div :id="id" />',
    });
    const wrapper = mount(Host);
    const id = wrapper.attributes('id');
    await wrapper.vm.$forceUpdate();
    expect(id).toMatch(/^cui-field-/);
    expect(wrapper.attributes('id')).toBe(id);
  });
});
