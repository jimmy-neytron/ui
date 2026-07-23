<script setup lang="ts">
import { useAttrs } from 'vue';
import type { UiSpinnerProps } from './UiSpinner.types';
import { useUiLocale } from '../../config/locale';

defineOptions({ name: 'UiSpinner', inheritAttrs: false });

withDefaults(defineProps<UiSpinnerProps>(), {
  size: 'md',
  tone: 'current',
  decorative: false,
});

const attrs = useAttrs();
const locale = useUiLocale();
</script>

<template>
  <span
    v-bind="attrs"
    class="cui-loader"
    :data-size="size"
    :data-tone="tone"
    :role="decorative ? undefined : 'status'"
    :aria-label="decorative ? undefined : (label ?? locale.loading)"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span class="cui-loader__circle" aria-hidden="true" />
  </span>
</template>
