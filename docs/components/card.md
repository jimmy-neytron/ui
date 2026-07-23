<script setup>
import { UiBadge, UiButton, UiCard } from '@compact-ui';
</script>

# Card

Контейнер для связанного содержимого. Семантический HTML-элемент выбирается через prop as.

## Variants

<DemoFrame title="variant">
  <div class="demo-grid">
    <UiCard variant="outline">Outline card</UiCard>
    <UiCard variant="filled">Filled card</UiCard>
    <UiCard variant="elevated">Elevated card</UiCard>
  </div>
</DemoFrame>

## Padding

<DemoFrame title="padding">
  <div class="demo-grid">
    <UiCard padding="none"><div style="padding: 8px">None</div></UiCard>
    <UiCard padding="sm">Small</UiCard>
    <UiCard padding="md">Medium</UiCard>
    <UiCard padding="lg">Large</UiCard>
  </div>
</DemoFrame>

## Составные области

<DemoFrame title="as, media, header, default, footer">
  <UiCard as="article" variant="elevated" aria-labelledby="release-title">
    <template #media>
      <div style="height: 72px; background: linear-gradient(135deg, var(--cui-color-primary), var(--cui-color-success))" />
    </template>
    <template #header>
      <div class="demo-row demo-row--center">
        <strong id="release-title">Версия 0.3.0</strong>
        <UiBadge tone="success">Stable</UiBadge>
      </div>
    </template>
    Новые компоненты доступны через root и direct imports.
    <template #footer><UiButton size="sm">Подробнее</UiButton></template>
  </UiCard>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| as | string | section |
| variant | elevated, outline, filled | outline |
| padding | none, sm, md, lg | md |

Slots: media, header, default, footer. Native attrs передаются выбранному корневому элементу.
