<script setup lang="ts">
import { ref } from 'vue';
import {
  UiBadge,
  UiButton,
  UiCheckbox,
  UiInput,
  UiSelect,
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
    <UiInput v-model="email" type="email" label="Email" clearable />
    <UiSelect v-model="framework" :options="options" label="Технология" clearable />
    <UiTextarea v-model="message" label="Описание" :maxlength="120" show-count />
    <div class="component-gallery__choices">
      <UiCheckbox v-model="accepted" label="Условия приняты" />
      <UiSwitch v-model="notifications" label="Уведомления" />
    </div>
  </div>
</template>
