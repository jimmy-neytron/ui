<script setup lang="ts">
import { ref } from 'vue';
import {
  UiAlert,
  UiBadge,
  UiButton,
  UiCard,
  UiCheckbox,
  UiInput,
  UiProgress,
  UiSelect,
  UiSpinner,
  UiSwitch,
  UiTextarea,
} from '@compact-ui';
import type { UiSelectOption } from '@compact-ui';

const email = ref('team@example.com');
const message = ref('Небольшая библиотека для продуктовых интерфейсов.');
const framework = ref<string | number | null>('vue');
const accepted = ref(true);
const notifications = ref(false);
const options: UiSelectOption[] = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vite', value: 'vite' },
];
</script>

<template>
  <div class="component-gallery">
    <div class="component-gallery__actions">
      <UiButton>Сохранить</UiButton>
      <UiButton variant="secondary">Отмена</UiButton>
      <UiButton variant="ghost">Подробнее</UiButton>
      <UiBadge tone="success" dot>v0.2.1</UiBadge>
    </div>
    <UiAlert tone="success" title="Готово">Все компоненты подключены.</UiAlert>
    <UiCard variant="filled">Карточка использует общие токены темы.</UiCard>
    <UiProgress label="Покрытие API" :value="100" show-value />
    <div class="component-gallery__actions"><UiSpinner size="sm" /> Загрузка</div>
    <UiInput v-model="email" type="email" label="Email" clearable />
    <UiSelect v-model="framework" :options="options" label="Технология" clearable />
    <UiTextarea v-model="message" label="Описание" :maxlength="120" show-count />
    <div class="component-gallery__choices">
      <UiCheckbox v-model="accepted" label="Условия приняты" />
      <UiSwitch v-model="notifications" label="Уведомления" />
    </div>
  </div>
</template>
