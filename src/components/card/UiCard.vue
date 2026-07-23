<script setup lang="ts">
import { useAttrs } from 'vue';
import type { UiCardProps } from './UiCard.types';

defineOptions({ name: 'UiCard', inheritAttrs: false });

withDefaults(defineProps<UiCardProps>(), {
  as: 'section',
  variant: 'outline',
  padding: 'md',
});

const attrs = useAttrs();
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    class="cui-card"
    :data-variant="variant"
    :data-padding="padding"
  >
    <div v-if="$slots.media" class="cui-card__media"><slot name="media" /></div>
    <div v-if="$slots.header" class="cui-card__header"><slot name="header" /></div>
    <div v-if="$slots.default" class="cui-card__body"><slot /></div>
    <div v-if="$slots.footer" class="cui-card__footer"><slot name="footer" /></div>
  </component>
</template>
