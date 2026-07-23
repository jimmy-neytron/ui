<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { UiButton, UiToastProvider, useToast } from '@compact-ui';
import type { UiToastTone } from '@compact-ui';

const notifications: readonly { label: string; tone: UiToastTone; title: string; description: string }[] = [
  { label: 'Обычное', tone: 'neutral', title: 'Новое уведомление', description: 'Здесь находится нейтральная информация.' },
  { label: 'Успех', tone: 'success', title: 'Изменения сохранены', description: 'Данные успешно обновлены.' },
  { label: 'Предупреждение', tone: 'warning', title: 'Проверьте данные', description: 'Некоторые поля требуют внимания.' },
  { label: 'Ошибка', tone: 'danger', title: 'Не удалось сохранить', description: 'Повторите попытку немного позже.' },
];

const ToastActions = defineComponent({
  name: 'ToastActions',
  setup() {
    const toast = useToast();
    return () => h('div', { class: 'toast-playground__actions' }, [
      ...notifications.map((notification) => h(
        UiButton,
        {
          variant: notification.tone === 'neutral' ? 'secondary' : 'primary',
          onClick: () => toast.push({
            title: notification.title,
            description: notification.description,
            tone: notification.tone,
            duration: 5000,
          }),
        },
        { default: () => notification.label },
      )),
      h(
        UiButton,
        { variant: 'ghost', onClick: () => toast.clear() },
        { default: () => 'Закрыть все' },
      ),
    ]);
  },
});
</script>

<template>
  <UiToastProvider>
    <ToastActions />
  </UiToastProvider>
</template>