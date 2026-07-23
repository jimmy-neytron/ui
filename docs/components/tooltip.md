<script setup>
import { UiButton, UiTooltip } from '@compact-ui';
const placements = ['top', 'right', 'bottom', 'left'];
</script>

# Tooltip

Короткая подсказка по hover и focus. По умолчанию переносится в `body`, автоматически меняет сторону и обновляет позицию при прокрутке любого родителя.

## Автоматическое позиционирование

`placement` задаёт предпочтительную сторону. Если места недостаточно, Tooltip выбирает противоположную или соседнюю сторону.

<DemoFrame title="content, placement, autoPlacement, boundaryPadding, delay, teleport">
  <div class="demo-row demo-row--center">
    <UiTooltip
      v-for="placement in placements"
      :key="placement"
      :content="`Предпочтительная позиция: ${placement}`"
      :placement="placement"
      :delay="0"
    >
      <template #trigger><UiButton variant="secondary">{{ placement }}</UiButton></template>
    </UiTooltip>
  </div>
</DemoFrame>

## Фиксированная сторона

Отключите `autoPlacement`, только если автоматический flip не нужен.

<DemoFrame title="autoPlacement, disabled, default">
  <UiTooltip placement="top" :auto-placement="false" :delay="0">
    <template #trigger><UiButton>Без flip</UiButton></template>
    Текст из default slot
  </UiTooltip>
</DemoFrame>

## Props

<ApiTable component="UiTooltipProps" />

Слоты: `trigger`, `default`. Закрывается по `Escape`, уходу focus или указателя.