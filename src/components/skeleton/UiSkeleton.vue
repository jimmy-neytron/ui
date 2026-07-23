<script setup lang="ts">
import { computed } from 'vue';
import type { UiSkeletonProps } from './UiSkeleton.types';
defineOptions({ name: 'UiSkeleton' });
const props = withDefaults(defineProps<UiSkeletonProps>(), { variant: 'text', lines: 1, animated: true });
const style = computed(() => ({
  inlineSize: typeof props.width === 'number' ? `${props.width}px` : props.width,
  blockSize: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>
<template>
  <span class="cui-skeleton-group" :role="label ? 'status' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'">
    <span v-for="line in Math.max(1, lines)" :key="line" class="cui-skeleton" :data-variant="variant" :data-animated="animated || undefined" :style="style" />
  </span>
</template>
