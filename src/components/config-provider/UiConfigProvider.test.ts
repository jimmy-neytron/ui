import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useUiLocale } from '../../config/locale';
import UiConfigProvider from './UiConfigProvider.vue';

const Consumer = defineComponent({
  setup() {
    return { locale: useUiLocale() };
  },
  template: '<span>{{ locale.close }}|{{ locale.loading }}</span>',
});

describe('UiConfigProvider', () => {
  it('provides partial localized messages with defaults', async () => {
    const wrapper = mount(UiConfigProvider, {
      props: { locale: { close: 'Закрыть' } },
      slots: { default: Consumer },
    });
    expect(wrapper.text()).toBe('Закрыть|Loading');
    await wrapper.setProps({ locale: { close: 'Скрыть', loading: 'Загрузка' } });
    expect(wrapper.text()).toBe('Скрыть|Загрузка');
  });

  it('uses defaults without a provider', () => {
    expect(mount(Consumer).text()).toBe('Close|Loading');
  });
});
