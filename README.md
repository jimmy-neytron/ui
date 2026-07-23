# Compact UI

Лёгкая ESM-first UI-библиотека для Vue 3: двенадцать полностью типизированных компонентов, CSS Custom Properties, светлая/тёмная/системная тема, гибкая настройка цветов, скруглений, типографики и отступов, SSR-safe реализация и проверяемый npm-процесс от playground до Trusted Publishing.

> npm-пакет: `@neytron/compact-ui`. Исходный код: `github.com/jimmy-neytron/ui`.

## Возможности

- `UiButton`, `UiInput`, `UiTextarea`, `UiSelect`, `UiCheckbox`, `UiRadio`, `UiSwitch`, `UiBadge`, `UiAlert`, `UiCard`, `UiProgress`, `UiSpinner`.
- Vue 3 Composition API и `<script setup lang="ts">`.
- TypeScript strict mode без runtime dependencies.
- Root imports и direct imports.
- Tree shaking, отдельный CSS entry, source maps и declaration files.
- Keyboard-first `UiSelect`: single, multiple, search, clear, disabled options, loading, empty/error states.
- Светлая, тёмная и системная темы без отдельного density-режима.
- SSR-safe: DOM API используются только после mount.
- Playground с HMR и отдельное consumer-приложение, устанавливающее настоящий `.tgz`.
- CI, bundle budgets, проверка tarball и OIDC publish workflow.

## Поддерживаемые версии

- Node.js: `>=24` для разработки и CI.
- Vue: `>=3.5.0 <4`, объявлен как `peerDependency` и исключён из bundle.
- Пакет ESM-only. UMD и CJS намеренно не поставляются.

## Установка

```bash
npm install @neytron/compact-ui
```

Vue должен быть установлен в приложении-потребителе:

```bash
npm install vue
```

## Импорт CSS

Импортируйте стили один раз в entry приложения:

```ts
import '@neytron/compact-ui/styles.css';
```

## Root imports

```ts
import {
  UiButton,
  UiInput,
  UiTextarea,
  UiSelect,
} from '@neytron/compact-ui';
```

## Direct imports

```ts
import { UiButton } from '@neytron/compact-ui/button';
import { UiInput } from '@neytron/compact-ui/input';
import { UiTextarea } from '@neytron/compact-ui/textarea';
import { UiSelect } from '@neytron/compact-ui/select';
import { UiAlert } from '@neytron/compact-ui/alert';
import { UiCard } from '@neytron/compact-ui/card';
import { UiProgress } from '@neytron/compact-ui/progress';
import { UiSpinner } from '@neytron/compact-ui/spinner';
```

Direct imports полезны, когда сборщик приложения не выполняет автоматическое tree shaking root entry.

## TypeScript types

Публичные типы экспортируются как из root entry, так и из соответствующих direct entry:

```ts
import type {
  UiButtonVariant,
  UiInputModelValue,
  UiTextareaResize,
  UiSelectOption,
  UiSelectValue,
} from '@neytron/compact-ui';
```

## Controlled usage и `v-model`

Все поля являются controlled components и не изменяют props:

```vue
<UiInput
  :model-value="value"
  @update:model-value="value = $event"
/>
```

Эквивалентная сокращённая форма:

```vue
<UiInput v-model="value" />
```

## UiButton

```vue
<UiButton variant="primary" size="md" @click="save">
  <template #leading>+</template>
  Save
</UiButton>
```

Props:

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `type` | native button type | `'button'` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `block` | `boolean` | `false` |
| `aria-label` | `string` | — |

Slots: `default`, `leading`, `trailing`, `loader`.

`loading` добавляет `aria-busy="true"`, блокирует повторный click и сохраняет размеры контента. Для icon-only кнопки передавайте доступное имя через `aria-label`.

## UiInput

```vue
<UiInput
  v-model="email"
  type="email"
  label="Email"
  hint="Используйте рабочий адрес"
  autocomplete="email"
  clearable
/>
```

Поддерживаются строковые и числовые значения, `label`, `placeholder`, `hint`, `error`, `size`, `disabled`, `readonly`, `required`, `clearable`, `name`, `autocomplete`, `inputmode`, `min`, `max`, `step`, `maxlength`, `pattern` и остальные native attrs.

Slots: `prefix`, `suffix`.

Events: `update:modelValue`, `focus`, `blur`, `change`, `clear`.

Label, hint и error связываются со стабильными SSR-safe id. При ошибке используются `aria-invalid` и `aria-describedby`.

## UiTextarea

```vue
<UiTextarea
  v-model="description"
  label="Description"
  :maxlength="500"
  show-count
  auto-resize
/>
```

Props: `modelValue`, `label`, `placeholder`, `hint`, `error`, `rows`, `maxlength`, `showCount`, `resize`, `autoResize`, `disabled`, `readonly`, `required`, `name`.

`resize`: `'none' | 'vertical' | 'horizontal' | 'both'`.

При `autoResize=false` сохраняется native resize. При `autoResize=true` высота обновляется после изменения значения без обращения к DOM на уровне импорта.

## UiSelect

Базовые типы:

```ts
export type UiSelectValue = string | number;

export interface UiSelectOption<TValue extends UiSelectValue = UiSelectValue> {
  label: string;
  value: TValue;
  disabled?: boolean;
}
```

### Single select

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { UiSelectOption, UiSelectValue } from '@neytron/compact-ui';

const value = ref<UiSelectValue | null>(null);
const options: UiSelectOption[] = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
];
</script>

<template>
  <UiSelect v-model="value" :options="options" clearable />
</template>
```

### Multiple select

```vue
<script setup lang="ts">
const values = ref<UiSelectValue[]>([]);
</script>

<template>
  <UiSelect
    v-model="values"
    :options="options"
    multiple
    clearable
  />
</template>
```

Multiple mode всегда возвращает новый массив и не изменяет входной `modelValue`. Для каждого выбранного значения отображается chip с доступной кнопкой удаления.

### Searchable select

```vue
<UiSelect
  v-model="value"
  :options="options"
  searchable
  search-placeholder="Search locally"
  @search="query = $event"
/>
```

Поиск локальный, регистронезависимый и не выполняет fetch. Remote search и virtualization не входят в первую версию.

Props: `modelValue`, `options`, `multiple`, `searchable`, `clearable`, `disabled`, `loading`, `error`, `label`, `hint`, `placeholder`, `searchPlaceholder`, `noOptionsText`, `noResultsText`, `name`, `size`, `closeOnSelect`, `maxMenuHeight`.

Slots: `selected`, `option`, `empty`, `loading`, `prefix`, `suffix`.

Events: `update:modelValue`, `open`, `close`, `search`, `clear`, `focus`, `blur`.

Keyboard: `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, `Space`, `Escape`, `Tab`. Disabled options пропускаются. `Tab` не блокируется. `Escape` закрывает menu и возвращает focus на trigger.

При наличии `name` создаются hidden inputs. В multiple mode создаётся отдельный input с одинаковым именем для каждого выбранного primitive value.

## Slots

Slots принимают VNode-контент приложения и не преобразуются в HTML-строки. Библиотека не использует `v-html` или `innerHTML`.

Пример кастомного option:

```vue
<UiSelect v-model="value" :options="options">
  <template #option="{ option, selected }">
    <strong>{{ option.label }}</strong>
    <span v-if="selected">Selected</span>
  </template>
</UiSelect>
```

## Темы

Тема задаётся data attribute на любом контейнере:

```html
<div data-cui-theme="dark">...</div>
```

### Light theme

```html
<section data-cui-theme="light">...</section>
```

### Dark theme

```html
<section data-cui-theme="dark">...</section>
```

### System theme

```html
<section data-cui-theme="system">...</section>
```

`system` следует `prefers-color-scheme`. При отсутствии attribute корневые tokens также следуют системной теме.

## Кастомизация

### Primary color

```css
:root {
  --cui-color-primary: #7c3aed;
  --cui-color-primary-hover: #6d28d9;
}
```

### Скругления

```css
.product-theme {
  --cui-color-primary: #6d28d9;
  --cui-color-primary-hover: #5b21b6;
  --cui-radius-sm: 8px;
  --cui-radius-md: 12px;
  --cui-radius-lg: 16px;
}
```

```vue
<template>
  <section class="product-theme" data-cui-theme="dark">
    <UiButton>Save</UiButton>
  </section>
</template>
```

### Размеры через шрифты и отступы

Библиотека не использует отдельный `density`-режим и не фиксирует высоту контролов. Итоговый размер формируется из `font-size`, `line-height` и padding-токенов. Это позволяет приложению настроить компактность без дополнительного data attribute:

```css
.compact-product-ui {
  --cui-control-font-size-sm: 0.75rem;
  --cui-control-font-size-md: 0.8125rem;
  --cui-control-font-size-lg: 0.9375rem;
  --cui-control-padding-block-sm: 0.25rem;
  --cui-control-padding-block-md: 0.375rem;
  --cui-control-padding-block-lg: 0.5rem;
  --cui-control-padding-inline-sm: 0.5rem;
  --cui-control-padding-inline-md: 0.625rem;
  --cui-control-padding-inline-lg: 0.75rem;
}
```

Размеры `sm`, `md` и `lg` остаются частью API компонентов, но каждый вариант использует соответствующие font и padding tokens, а не жёсткую высоту.

## Публичные CSS variables

Primitive tokens:

- Colors: `--cui-neutral-0`, `--cui-neutral-50` … `--cui-neutral-950`, `--cui-blue-500`, `--cui-blue-600`, `--cui-green-500`, `--cui-amber-500`, `--cui-red-500`, `--cui-red-600`.
- Spacing: `--cui-space-0`, `--cui-space-1`, `--cui-space-2`, `--cui-space-3`, `--cui-space-4`, `--cui-space-5`, `--cui-space-6`, `--cui-space-8`.
- Typography: `--cui-font-size-xs`, `--cui-font-size-sm`, `--cui-font-size-md`, `--cui-font-size-lg`, `--cui-font-weight-normal`, `--cui-font-weight-medium`, `--cui-font-weight-semibold`, `--cui-line-height-tight`, `--cui-line-height-normal`.
- Radius: `--cui-radius-1`, `--cui-radius-2`, `--cui-radius-3`, `--cui-radius-pill`.
- Motion: `--cui-duration-fast`, `--cui-duration-normal`, `--cui-easing-standard`, `--cui-easing-emphasized`.
- Other: `--cui-z-dropdown`, `--cui-opacity-disabled`, `--cui-opacity-loading`.

Semantic tokens:

- Surfaces: `--cui-color-background`, `--cui-color-surface`, `--cui-color-surface-subtle`, `--cui-color-surface-hover`, `--cui-color-surface-active`.
- Text: `--cui-color-text`, `--cui-color-text-muted`, `--cui-color-text-on-primary`.
- Borders: `--cui-color-border`, `--cui-color-border-strong`.
- Primary: `--cui-color-primary`, `--cui-color-primary-hover`, `--cui-color-primary-subtle`.
- Status: `--cui-color-success`, `--cui-color-warning`, `--cui-color-danger`, `--cui-color-danger-hover`, `--cui-color-danger-subtle`.
- Focus and shadow: `--cui-color-focus`, `--cui-shadow-sm`, `--cui-shadow-md`, `--cui-focus-outline-width`, `--cui-focus-outline-offset`. Компоненты подавляют browser glow и показывают чёткую обводку только через `:focus-visible`.
- Public radii: `--cui-radius-sm`, `--cui-radius-md`, `--cui-radius-lg`.
- Control typography and spacing: `--cui-control-font-size-sm`, `--cui-control-font-size-md`, `--cui-control-font-size-lg`, `--cui-control-padding-block-sm`, `--cui-control-padding-block-md`, `--cui-control-padding-block-lg`, `--cui-control-padding-inline-sm`, `--cui-control-padding-inline-md`, `--cui-control-padding-inline-lg`, `--cui-control-gap`.

Component tokens:

- Button: `--cui-button-radius`, `--cui-button-font-size`, `--cui-button-padding-block`, `--cui-button-padding-inline`.
- Input: `--cui-input-radius`, `--cui-input-font-size`, `--cui-input-padding-block`, `--cui-input-padding-inline`, `--cui-input-background`, `--cui-input-border-color`, `--cui-input-border-color-hover`, `--cui-input-placeholder-color`.
- Textarea: `--cui-textarea-min-height`, `--cui-textarea-radius`, `--cui-textarea-font-size`, `--cui-textarea-padding-block`, `--cui-textarea-padding-inline`.
- Select: `--cui-select-radius`, `--cui-select-font-size`, `--cui-select-padding-block`, `--cui-select-padding-inline`, `--cui-select-option-padding-block`, `--cui-select-option-padding-inline`, `--cui-select-search-padding-block`, `--cui-select-search-padding-inline`, `--cui-select-menu-max-height`, `--cui-select-menu-shadow`.

## Accessibility

Компоненты используют semantic HTML там, где это возможно. `UiSelect` реализует combobox/listbox contract с `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-selected`, keyboard navigation и disabled options. Поля связывают labels и messages через стабильные id. Browser focus glow отключён, но клавиатурный focus остаётся видимым благодаря чёткой `:focus-visible`-обводке. Reduced motion учитывается, информация об ошибке передаётся не только цветом.

WCAG 2.2 AA зависит также от цветов и контента приложения-потребителя. При переопределении tokens проверяйте контраст.

## SSR

На уровне import отсутствуют обращения к `window`, `document`, `navigator`, storage и observers. `useClickOutside` подписывается после mount и снимает listener при unmount. Стабильные id строятся через Vue `useId`, поэтому подходят для hydration.

## Nuxt 3

Plugin не требуется:

```vue
<script setup lang="ts">
import { UiButton } from '@neytron/compact-ui/button';
import '@neytron/compact-ui/styles.css';
</script>

<template>
  <UiButton>Continue</UiButton>
</template>
```

CSS обычно импортируют один раз в `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['@neytron/compact-ui/styles.css'],
});
```

## Tree shaking

Vue объявлен external. Production dependencies отсутствуют. Пакет публикует ESM entries и отмечает CSS как side effect:

```json
{
  "sideEffects": ["**/*.css"]
}
```

## Bundle size

Ориентировочные gzip budgets:

| Target | Budget |
|---|---:|
| Full JS без Vue | 30 KB |
| CSS | 12 KB |
| Button | 3 KB |
| Input | 3 KB |
| Textarea | 3 KB |
| Select | 12 KB |

Фактические raw/gzip sizes выводит:

```bash
npm run build
npm run check:size
```

## Browser support

Ориентир — современные evergreen browsers с поддержкой ES2022, CSS Custom Properties, logical properties, `color-scheme` и CSS `:has()`, который используется для аккуратного keyboard focus у составного input-контрола. Legacy browsers и IE не поддерживаются. Polyfills не поставляются.

## Ограничения первой версии

- `UiSelect` не использует Teleport и позиционируется абсолютно относительно собственного контейнера. Родитель с `overflow: hidden` может обрезать menu.
- Нет collision detection, remote search, virtualization и async fetch внутри компонента.
- Значения select ограничены `string | number`.
- Встроенный набор иконок и шрифты не поставляются.
- Form validation engine не входит в библиотеку; error передаётся извне.

Архитектура menu изолирована CSS-классом и внутренним слоем, поэтому positioning adapter можно добавить позднее без изменения public props.

## Локальная разработка

### Установка зависимостей

Для зафиксированного lock-файла:

```bash
npm ci
```

При первоначальном обновлении dependency graph:

```bash
npm install
```

### Playground

```bash
npm run dev
```

Playground импортирует компоненты непосредственно из `src` и поддерживает HMR. Панель позволяет менять тему, primary color и радиусы; отдельного density или control-height переключателя нет.

Production playground:

```bash
npm run playground:build
npm run playground:preview
```

### Unit-тесты

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Typecheck

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

Команда очищает `dist`, запускает Vite library build и `vue-tsc`, создавая JS, CSS, source maps и `.d.ts` для всех public entries.

### Полная локальная проверка

```bash
npm run check
```

## `npm pack`

Просмотр будущего содержимого пакета:

```bash
npm run pack:dry
```

Создание tarball в `.artifacts/`:

```bash
npm run pack
```

Проверка whitelist, entry points, запрещённых файлов и больших файлов:

```bash
npm run check:package
```

## Тестирование tarball

```bash
npm run test:package
```

Скрипт:

1. очищает старые `.tgz`;
2. выполняет production build;
3. получает фактическое имя из `npm pack --json`;
4. устанавливает tarball в `examples/consumer` без alias на `src`;
5. запускает consumer typecheck и production build;
6. удаляет tarball, если не передан `--keep`.

```bash
node scripts/test-package.mjs --keep
```

Успешная работа playground **не доказывает**, что npm-пакет собран правильно. Playground проверяет исходники. `test:package` проверяет реальный `.tgz`, exports, CSS и declarations.

`npm link` допустим только как дополнительный инструмент: он может создать вторую копию Vue, отличается от tarball, маскирует ошибки `exports` и иначе разрешает peer dependencies.

## Публикация в npm: первая настройка

1. Создайте npm-аккаунт.
2. Включите 2FA.
3. Выберите свободное имя пакета и создайте личный или organization scope.
4. Убедитесь, что npm scope `jimmy-neytron` принадлежит вашему npm-аккаунту.
5. Обновите `repository`, `homepage`, `bugs`, `author`.
6. Войдите и проверьте пользователя:

```bash
npm login
npm whoami
```

7. Выполните проверки:

```bash
npm run check
npm run test:package
npm run pack:dry
```

8. Первая ручная публикация scoped public package:

```bash
npm publish --access public
```

9. В npm package settings настройте Trusted Publisher: GitHub owner, repository, workflow filename `publish.yml`, environment `npm-production`, action `npm publish`.
10. После проверки OIDC отключите традиционные publish tokens для пакета.

Реальный `npm publish` не вызывается ни одним локальным build/test script.

## Trusted Publishing

`.github/workflows/publish.yml` запускается только после публикации GitHub Release или вручную с существующим tag. Workflow:

- checkout конкретного tag;
- проверяет `vX.Y.Z` против `package.json`;
- запускает полный `check` и `test:package`;
- проверяет отсутствие версии в registry;
- публикует через OIDC с `contents: read` и `id-token: write`;
- использует GitHub Environment `npm-production` для approval rules;
- не содержит `NPM_TOKEN`, не изменяет version и не создаёт commits/tags.

## Versioning

Используется Semantic Versioning. Рабочее дерево должно быть чистым:

```bash
npm version patch
npm version minor
npm version major
```

Затем:

```bash
git push --follow-tags
```

Рекомендуемый процесс:

```text
commit → pull request → CI → merge → npm version → Git tag → GitHub Release → publish workflow → npm
```

Одна и та же версия повторно не публикуется.

## Contribution

См. [CONTRIBUTING.md](./CONTRIBUTING.md). Перед pull request выполните `npm run check` и `npm run test:package`.

## Security

См. [SECURITY.md](./SECURITY.md). Не публикуйте vulnerability details в public issue до согласованного раскрытия.

## License

MIT. См. [LICENSE](./LICENSE).
