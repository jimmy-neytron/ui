<script setup>
import { UiSpinner } from '@compact-ui';
</script>

# Spinner

Компактный индикатор ожидания. По умолчанию объявляется скринридеру как статус; внутри уже озвучиваемой кнопки используйте decorative.

## Размеры

<DemoFrame title="size">
  <div class="demo-row demo-row--center">
    <UiSpinner size="sm" />
    <UiSpinner size="md" />
    <UiSpinner size="lg" />
  </div>
</DemoFrame>

## Tones

<DemoFrame title="tone">
  <div class="demo-row demo-row--center">
    <UiSpinner tone="current" />
    <UiSpinner tone="primary" />
    <UiSpinner tone="muted" />
    <span style="padding: 8px; background: var(--cui-color-primary)"><UiSpinner tone="inverted" /></span>
  </div>
</DemoFrame>

## Доступность

<DemoFrame title="label, decorative, native attrs">
  <div class="demo-row demo-row--center">
    <UiSpinner label="Загрузка профиля" data-testid="profile-loader" />
    <span>Синхронизация <UiSpinner decorative size="sm" /></span>
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| size | sm, md, lg | md |
| tone | current, primary, muted, inverted | current |
| label | string | Loading |
| decorative | boolean | false |

У недекоративного spinner есть role=status и доступное имя из label. При decorative=true устанавливается aria-hidden=true. Native attrs передаются корневому span.
