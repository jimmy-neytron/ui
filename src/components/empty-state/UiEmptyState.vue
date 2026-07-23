<script setup lang="ts">
import type { UiEmptyStateProps } from './UiEmptyState.types';
defineOptions({ name: 'UiEmptyState' });
withDefaults(defineProps<UiEmptyStateProps>(), { size: 'md' });
</script>
<template>
  <section class="cui-empty-state" :data-size="size">
    <div v-if="$slots.icon" class="cui-empty-state__icon" aria-hidden="true"><slot name="icon" /></div>
    <h3 v-if="title || $slots.title" class="cui-empty-state__title"><slot name="title">{{ title }}</slot></h3>
    <p v-if="description || $slots.default" class="cui-empty-state__description"><slot>{{ description }}</slot></p>
    <div v-if="$slots.actions" class="cui-empty-state__actions"><slot name="actions" /></div>
  </section>
</template>
