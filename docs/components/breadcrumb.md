<script setup>
import { UiBreadcrumb } from '@compact-ui';

const arrayItems = [
  { label: 'Главная' },
  { label: 'Каталог' },
  { label: 'Компоненты' },
  { label: 'Breadcrumb' },
];

const objectItems = {
  home: { label: 'Главная' },
  account: { label: 'Профиль' },
  settings: { label: 'Настройки' },
};
</script>

# Breadcrumb

Навигационная цепочка. Последний элемент автоматически становится текущей страницей.

## Массив элементов

<DemoFrame title="items, ariaLabel">
  <UiBreadcrumb :items="arrayItems" aria-label="Путь по документации" />
</DemoFrame>

## Объект элементов

Ключи объекта используются только для удобной организации данных.

<DemoFrame title="items as object">
  <UiBreadcrumb :items="objectItems" />
</DemoFrame>

## Собственный элемент и разделитель

<DemoFrame title="item, separator">
  <UiBreadcrumb :items="arrayItems">
    <template #item="{ item, current }">
      <span :style="{ fontWeight: current ? 600 : 400 }">{{ item.label }}</span>
    </template>
    <template #separator>
      <span>→</span>
    </template>
  </UiBreadcrumb>
</DemoFrame>

## Props

<ApiTable component="UiBreadcrumbProps" />

`items` принимает:

- массив `{ label, href?, disabled? }[]`;
- объект-словарь `Record<string, { label, href?, disabled? }>`;
- один объект `{ label, href?, disabled? }`.

Слоты: `item`, `separator`.