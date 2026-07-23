<script setup>
import { ref } from 'vue';
import { UiButton, UiPopover } from '@compact-ui';

const open = ref(false);
const fixed = ref(false);
</script>

# Popover

Немодальная карточка рядом с любым trigger. Компонент не навязывает trigger внешний вид кнопки.

## Текстовый trigger

<DemoFrame title="modelValue, placement, trigger">
  <UiPopover v-model="open" placement="bottom">
    <template #trigger="{ open: isOpen }">
      <button class="popover-text-trigger" type="button" :aria-expanded="isOpen">
        Подробнее о настройках
      </button>
    </template>
    <strong>Настройки профиля</strong>
    <p>Здесь могут находиться текст, поля ввода и действия.</p>
  </UiPopover>
</DemoFrame>

## Произвольный trigger и guards

<DemoFrame title="closeOnEscape, closeOnOutside, disabled">
  <div class="demo-row demo-row--center">
    <UiPopover v-model="fixed" placement="right" :close-on-escape="false" :close-on-outside="false">
      <template #trigger><UiButton variant="secondary">Открыть панель</UiButton></template>
      <div class="demo-stack">
        <strong>Фиксированная панель</strong>
        <UiButton size="sm" @click="fixed = false">Закрыть</UiButton>
      </div>
    </UiPopover>
  </div>
</DemoFrame>

## Props

<ApiTable component="UiPopoverProps" />

События: `update:modelValue`, `open`, `close`. Слоты: `trigger`, `default`.

<style scoped>
.popover-text-trigger {
  border: 0;
  padding: 0;
  color: var(--cui-color-primary);
  background: transparent;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  cursor: pointer;
}
</style>