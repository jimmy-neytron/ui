<script setup lang="ts">
import { useAttrs } from 'vue';
import type { UiButtonProps } from './UiButton.types';

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UiButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <button
    v-bind="attrs"
    class="cui-button"
    :class="{
      'cui-button--block': block,
    }"
    :data-variant="variant"
    :data-size="size"
    :data-loading="loading || undefined"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-busy="loading ? 'true' : undefined"
    @click="handleClick"
  >
    <span class="cui-button__content" :aria-hidden="loading ? 'true' : undefined">
      <span v-if="$slots.leading" class="cui-button__icon">
        <slot name="leading" />
      </span>
      <span class="cui-button__label"><slot /></span>
      <span v-if="$slots.trailing" class="cui-button__icon">
        <slot name="trailing" />
      </span>
    </span>

    <span v-if="loading" class="cui-button__loader" aria-hidden="true">
      <slot name="loader">
        <span class="cui-spinner" />
      </slot>
    </span>
  </button>
</template>
