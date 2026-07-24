# Compact UI

Лёгкая типизированная UI-библиотека для Vue 3. Включает элементы форм,
навигацию, оверлеи, уведомления и компоненты для отображения данных.

[Документация и примеры](https://neytron-ui.netlify.app/)

## Установка

```bash
npm install @neytron/compact-ui vue
```

Требуется Vue `>=3.5.0 <4` и современный ESM-сборщик.

## Быстрый старт

Подключите стили один раз в entry-файле приложения:

```ts
import { createApp } from 'vue';
import App from './App.vue';
import '@neytron/compact-ui/styles.css';

createApp(App).mount('#app');
```

После этого импортируйте нужные компоненты:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiInput, UiSelect } from '@neytron/compact-ui';

const name = ref('');
const role = ref<string | number | null>(null);

const roles = [
  { label: 'Разработчик', value: 'developer' },
  { label: 'Дизайнер', value: 'designer' },
];
</script>

<template>
  <form @submit.prevent>
    <UiInput v-model="name" label="Имя" required />
    <UiSelect v-model="role" :options="roles" label="Роль" />
    <UiButton type="submit">Продолжить</UiButton>
  </form>
</template>
```

## Компоненты

- Формы: `UiInput`, `UiTextarea`, `UiSelect`, `UiCheckbox`, `UiRadio`,
  `UiSwitch`, `UiButton`.
- Данные и обратная связь: `UiAlert`, `UiBadge`, `UiCard`, `UiProgress`,
  `UiSkeleton`, `UiSpinner`, `UiEmptyState`, `UiAvatar`.
- Навигация: `UiAccordion`, `UiBreadcrumb`, `UiPagination`, `UiTabs`,
  `UiDropdownMenu`.
- Таблицы: `UiDataTable`, `UiDataTableFilters`.
- Оверлеи: `UiDialog`, `UiPopover`, `UiTooltip`.
- Уведомления: `UiToast`, `UiToastProvider`, `useToast`.
- Настройка: `UiConfigProvider`.

Полный API, интерактивные примеры и описание доступности находятся
в [документации](https://neytron-ui.netlify.app/).

## Импорты

Компоненты и TypeScript-типы доступны из общего entry:

```ts
import { UiButton, UiInput } from '@neytron/compact-ui';
import type { UiButtonProps, UiSelectOption } from '@neytron/compact-ui';
```

Также доступны прямые импорты:

```ts
import { UiButton } from '@neytron/compact-ui/button';
import { UiInput } from '@neytron/compact-ui/input';
import { UiSelect } from '@neytron/compact-ui/select';
```

## Темы

Без дополнительной настройки используется светлая тема. Тему можно задать
для всего приложения или отдельной его части:

```html
<div data-cui-theme="light">...</div>
<div data-cui-theme="dark">...</div>
<div data-cui-theme="system">...</div>
```

`system` следует системной настройке `prefers-color-scheme`.

Цвета, размеры и скругления настраиваются через CSS Custom Properties:

```css
[data-cui-theme='light'] {
  --cui-input-background: #ffffff;
  --cui-input-color: #171513;
  --cui-select-background: #ffffff;
  --cui-select-menu-background: #ffffff;
}

[data-cui-theme='dark'] {
  --cui-input-background: #171717;
  --cui-input-color: #f2f2f2;
  --cui-select-background: #171717;
  --cui-select-menu-background: #111111;
}

.product-theme {
  --cui-color-primary: #7c3aed;
  --cui-color-primary-hover: #6d28d9;
  --cui-radius-md: 12px;
  --cui-control-padding-block-md: 0.5rem;
}
```

```vue
<template>
  <section class="product-theme" data-cui-theme="light">
    <UiInput v-model="email" label="Email" />
    <UiButton>Сохранить</UiButton>
  </section>
</template>
```

Все доступные токены перечислены в
[руководстве по темам](https://neytron-ui.netlify.app/guide/theming).

## Локализация

Системные подписи компонентов по умолчанию используются на английском.
Для локализации передайте нужные сообщения в `UiConfigProvider`:

```vue
<script setup lang="ts">
import { UiConfigProvider } from '@neytron/compact-ui';

const locale = {
  close: 'Закрыть',
  clearInput: 'Очистить поле',
  clearSelection: 'Очистить выбор',
  loading: 'Загрузка',
  noOptions: 'Нет вариантов',
  noResults: 'Ничего не найдено',
};
</script>

<template>
  <UiConfigProvider :locale="locale">
    <App />
  </UiConfigProvider>
</template>
```

Непереданные сообщения сохраняют значения по умолчанию. Полный список ключей
доступен в [руководстве по локализации](https://neytron-ui.netlify.app/guide/localization).

## Nuxt

Отдельный Nuxt-плагин не требуется. Добавьте стили в `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['@neytron/compact-ui/styles.css'],
});
```

Затем импортируйте компоненты обычным способом:

```vue
<script setup lang="ts">
import { UiButton } from '@neytron/compact-ui/button';
</script>

<template>
  <UiButton>Продолжить</UiButton>
</template>
```

## Поддержка браузеров

Поддерживаются современные браузеры с CSS Custom Properties, logical
properties, `color-scheme` и `:has()`. Internet Explorer и другие устаревшие
браузеры не поддерживаются.

## Лицензия

MIT.
