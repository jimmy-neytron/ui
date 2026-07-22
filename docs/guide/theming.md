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

Без атрибута тема следует `prefers-color-scheme`.

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
