<script setup>
import { ref } from 'vue';
import { UiAccordion } from '@compact-ui';

const single = ref('one');
const multiple = ref(['one']);
const items = [
  { value: 'one', title: 'Что входит в библиотеку?', content: 'Компоненты, типы и готовые дизайн-токены.' },
  { value: 'two', title: 'Можно ли изменить оформление?', content: 'Да. Цвета, отступы и скругления управляются через CSS-переменные.' },
  { value: 'three', title: 'Недоступный раздел', disabled: true },
];
</script>

# Accordion

Группа раскрывающихся разделов. Компонент сам связывает кнопки и панели через ARIA-атрибуты.

## Одиночный выбор

<DemoFrame title="modelValue, items, collapsible">
  <UiAccordion v-model="single" :items="items" />
</DemoFrame>

## Несколько открытых разделов

<DemoFrame title="multiple, title, item, icon">
  <UiAccordion v-model="multiple" :items="items" multiple>
    <template #title="{ item }">
      {{ item.title }}
    </template>
    <template #item="{ item }">
      <strong>Ответ:</strong> {{ item.content }}
    </template>
    <template #icon="{ open }">
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
        <path :d="open ? 'M5 10h10' : 'M5 10h10M10 5v10'" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
    </template>
  </UiAccordion>
</DemoFrame>

## Props

<ApiTable component="UiAccordionProps" />

`items` содержит `value`, `title` и необязательные `content`, `disabled`.

События: `update:modelValue`, `change`.

Слоты:

- `title` — заголовок; получает `item` и `open`;
- `item` — содержимое панели; получает `item`;
- `icon` — иконка справа; получает `item` и `open`.