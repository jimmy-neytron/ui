<script setup>
import { ref } from 'vue';
import { UiTabs } from '@compact-ui';

const tab = ref('overview');
const items = [
  { value: 'overview', label: 'Обзор', panel: 'Краткое описание компонента и основные сценарии использования.' },
  { value: 'api', label: 'API', panel: 'Параметры, события и доступные слоты.' },
  { value: 'examples', label: 'Примеры', panel: 'Практические примеры использования.' },
  { value: 'disabled', label: 'Недоступно', disabled: true },
];
</script>

# Tabs

Компактные вкладки в стилистике UI-кита с клавиатурной навигацией.

## Горизонтальные вкладки

<DemoFrame title="modelValue, items, activation, ariaLabel">
  <div class="demo-block">
    <UiTabs v-model="tab" :items="items" aria-label="Разделы документации" />
  </div>
</DemoFrame>

## Вертикальные вкладки

<DemoFrame title="orientation, activation">
  <div class="demo-block">
    <UiTabs v-model="tab" :items="items" orientation="vertical" activation="manual" />
  </div>
</DemoFrame>

## Props

<ApiTable component="UiTabsProps" />

Клавиши: стрелки, `Home`, `End`; в manual-режиме — `Enter` и `Space`.

События: `update:modelValue`, `change`. Слоты: `tab`, `panel`.