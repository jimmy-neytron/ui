<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { UiProgressProps } from './UiProgress.types';

defineOptions({ name: 'UiProgress', inheritAttrs: false });

const props = withDefaults(defineProps<UiProgressProps>(), {
  value: null,
  min: 0,
  max: 100,
  showValue: false,
  size: 'md',
  tone: 'primary',
});

const attrs = useAttrs();
const safeMin = computed(() => Number.isFinite(props.min) ? props.min : 0);
const safeMax = computed(() =>
  Number.isFinite(props.max) && props.max > safeMin.value ? props.max : safeMin.value + 1,
);
const normalizedValue = computed(() => {
  if (props.value === null || !Number.isFinite(props.value)) {
    return null;
  }
  return Math.min(safeMax.value, Math.max(safeMin.value, props.value));
});
const percentage = computed(() => normalizedValue.value === null
  ? null
  : ((normalizedValue.value - safeMin.value) / (safeMax.value - safeMin.value)) * 100,
);
const valueText = computed(() => {
  if (normalizedValue.value === null) {
    return undefined;
  }
  return props.formatValue
    ? props.formatValue(normalizedValue.value, safeMin.value, safeMax.value)
    : `${Math.round(percentage.value as number)}%`;
});
</script>

<template>
  <div
    v-bind="attrs"
    class="cui-progress"
    :data-size="size"
    :data-tone="tone"
    :data-indeterminate="normalizedValue === null || undefined"
  >
    <div v-if="label || $slots.label || showValue" class="cui-progress__header">
      <span v-if="label || $slots.label" class="cui-progress__label">
        <slot name="label">{{ label }}</slot>
      </span>
      <span v-if="showValue && valueText" class="cui-progress__value">{{ valueText }}</span>
    </div>
    <div
      class="cui-progress__track"
      role="progressbar"
      :aria-label="!label && !$slots.label ? 'Progress' : undefined"
      :aria-valuemin="safeMin"
      :aria-valuemax="safeMax"
      :aria-valuenow="normalizedValue ?? undefined"
      :aria-valuetext="valueText"
    >
      <span
        class="cui-progress__bar"
        :style="percentage === null ? undefined : { inlineSize: `${percentage}%` }"
      />
    </div>
  </div>
</template>
