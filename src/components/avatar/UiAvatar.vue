<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { UiAvatarProps } from './UiAvatar.types';
defineOptions({ name: 'UiAvatar' });
const props = withDefaults(defineProps<UiAvatarProps>(), { alt: '', size: 'md', shape: 'circle' });
const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });
const initials = computed(() => props.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? '');
</script>
<template>
  <span class="cui-avatar" :data-size="size" :data-shape="shape">
    <img v-if="src && !failed" class="cui-avatar__image" :src="src" :alt="alt" @error="failed = true" />
    <span v-else class="cui-avatar__fallback" :aria-label="alt || name || undefined">
      <slot>{{ initials }}</slot>
    </span>
    <span v-if="status" class="cui-avatar__status" :data-status="status" aria-hidden="true">
      <slot name="status" />
    </span>
  </span>
</template>
