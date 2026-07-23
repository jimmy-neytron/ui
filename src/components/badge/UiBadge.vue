<script setup lang="ts">
import { useAttrs } from 'vue';
import type { UiBadgeProps } from './UiBadge.types';

defineOptions({ name: 'UiBadge', inheritAttrs: false });

withDefaults(defineProps<UiBadgeProps>(), {
  tone: 'neutral',
  variant: 'soft',
  size: 'md',
  dot: false,
});

const attrs = useAttrs();
</script>

<template>
  <span
    v-bind="attrs"
    class="cui-badge"
    :data-tone="tone"
    :data-variant="variant"
    :data-size="size"
  >
    <span v-if="dot" class="cui-badge__dot" aria-hidden="true" />
    <span v-if="$slots.leading" class="cui-badge__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <span class="cui-badge__label"><slot /></span>
  </span>
</template>
