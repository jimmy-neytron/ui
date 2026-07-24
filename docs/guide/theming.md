# Темы и CSS-токены

```ts
import '@neytron/compact-ui/styles.css';
```

## Выбор темы

```html
<div data-cui-theme="light">...</div>
<div data-cui-theme="dark">...</div>
<div data-cui-theme="system">...</div>
```

Без атрибута используется светлая тема. Это безопасный вариант для встраивания
компонентов в светлые сайты независимо от системной темы пользователя.

Тема `system` следует `prefers-color-scheme` только при явном указании:

```html
<div data-cui-theme="system">...</div>
```

Атрибут можно установить на всём приложении или на ближайшем контейнере с
компонентами. Для принудительно светлых контролов используйте
`data-cui-theme="light"`, для тёмных — `data-cui-theme="dark"`.

## Переопределение

```css
.product-theme {
  --cui-color-primary: #7c3aed;
  --cui-color-primary-hover: #6d28d9;
  --cui-radius-md: 12px;
  --cui-control-padding-block-md: 0.5rem;
}
```

## Публичные токены

| Группа | Переменные |
|---|---|
| Поверхности | `--cui-color-background`, `--cui-color-surface`, `--cui-color-surface-subtle`, `--cui-color-surface-hover`, `--cui-color-surface-active` |
| Текст/границы | `--cui-color-text`, `--cui-color-text-muted`, `--cui-color-text-on-primary`, `--cui-color-border`, `--cui-color-border-strong` |
| Primary/status | `--cui-color-primary`, `--cui-color-primary-hover`, `--cui-color-primary-subtle`, `--cui-color-success`, `--cui-color-warning`, `--cui-color-danger`, `--cui-color-danger-hover`, `--cui-color-danger-subtle` |
| Focus/тени | `--cui-color-focus`, `--cui-shadow-sm`, `--cui-shadow-md`, `--cui-focus-outline-width`, `--cui-focus-outline-offset` |
| Радиусы | `--cui-radius-sm`, `--cui-radius-md`, `--cui-radius-lg` |
| Размеры | `--cui-control-font-size-{sm,md,lg}`, `--cui-control-padding-block-{sm,md,lg}`, `--cui-control-padding-inline-{sm,md,lg}`, `--cui-control-gap` |
| Button | `--cui-button-radius`, `--cui-button-font-size`, `--cui-button-padding-block`, `--cui-button-padding-inline` |
| Input | `--cui-input-radius`, `--cui-input-font-size`, `--cui-input-padding-block`, `--cui-input-padding-inline`, `--cui-input-background`, `--cui-input-border-color`, `--cui-input-border-color-hover`, `--cui-input-placeholder-color` |
| Textarea | `--cui-textarea-min-height`, `--cui-textarea-radius`, `--cui-textarea-font-size`, `--cui-textarea-padding-block`, `--cui-textarea-padding-inline` |
| Select | `--cui-select-radius`, `--cui-select-font-size`, `--cui-select-padding-block`, `--cui-select-padding-inline`, `--cui-select-option-padding-block`, `--cui-select-option-padding-inline`, `--cui-select-search-padding-block`, `--cui-select-search-padding-inline`, `--cui-select-menu-max-height`, `--cui-select-menu-shadow` |
| Прочее | `--cui-opacity-disabled`, `--cui-opacity-loading`, `--cui-z-dropdown` |

Primitive tokens: neutral `0..950`, blue/green/amber/red, `--cui-space-{0,1,2,3,4,5,6,8}`, font size/weight/line-height, radius `1..3`/pill, duration/easing.

## Живая локальная тема

Токены наследуются как обычные CSS Custom Properties. Поэтому можно настроить всё приложение, отдельный продуктовый раздел или один компонент.

<DemoFrame title="Интерактивная кастомизация" description="Цвет и радиус применяются только внутри preview.">
  <CustomizationDemo />
</DemoFrame>

```css
.checkout-theme {
  /* Семантика продукта */
  --cui-color-primary: #7c3aed;
  --cui-color-primary-hover: #6d28d9;
  --cui-color-primary-subtle: rgb(124 58 237 / 14%);
  --cui-color-focus: #7c3aed;

  /* Общая плотность контролов */
  --cui-control-font-size-md: 0.875rem;
  --cui-control-padding-block-md: 0.5rem;

  /* Точечные component tokens */
  --cui-button-radius: 999px;
  --cui-input-radius: 10px;
  --cui-choice-checked-background: #7c3aed;
  --cui-switch-track-checked-background: #7c3aed;
  --cui-badge-radius: 6px;
}
```

```vue
<template>
  <section class="checkout-theme">
    <UiInput v-model="email" label="Email" />
    <UiCheckbox v-model="accepted" label="Согласен с условиями" />
    <UiSwitch v-model="notifications" label="Уведомления" />
    <UiButton>Оплатить</UiButton>
  </section>
</template>
```

## Иерархия настройки

1. Переопределяйте semantic tokens (`color`, `surface`, `border`) для общей темы.
2. Используйте control tokens для единой плотности `sm/md/lg`.
3. Используйте component tokens только для намеренных исключений.
4. Ставьте класс темы на ближайший общий контейнер, чтобы не менять другие части приложения.

Component tokens, добавленные начиная с версии 0.2.1:

- Checkbox/Radio: `--cui-choice-control-size`, `--cui-choice-radius`, `--cui-choice-border-color`, `--cui-choice-background`, `--cui-choice-checked-background`, `--cui-choice-checked-color`, `--cui-choice-gap`.
- Switch: `--cui-switch-track-width`, `--cui-switch-track-height`, `--cui-switch-track-background`, `--cui-switch-track-checked-background`, `--cui-switch-thumb-color`, `--cui-switch-gap`.
- Badge: `--cui-badge-radius`, `--cui-badge-font-size`, `--cui-badge-padding-block`, `--cui-badge-padding-inline`, `--cui-badge-gap`.

::: warning
После изменения цветов проверьте контраст текста, focus ring и состояния disabled в светлой и тёмной теме.
:::
