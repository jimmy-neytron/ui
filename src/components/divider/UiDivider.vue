<script setup lang="ts">
import type { UiDividerProps } from './UiDivider.types';
defineOptions({ name: 'UiDivider' });
withDefaults(defineProps<UiDividerProps>(), { orientation: 'horizontal', labelPosition: 'center' });
</script>
<template>
  <div class="cui-divider" role="separator" :aria-orientation="orientation" :data-orientation="orientation" :data-label-position="labelPosition">
    <span v-if="$slots.default" class="cui-divider__label"><slot /></span>
  </div>
</template>
