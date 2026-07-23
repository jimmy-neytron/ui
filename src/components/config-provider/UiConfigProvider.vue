<script setup lang="ts">
import { toRef } from 'vue';
import { provideUiLocale } from '../../config/locale';
import type { UiConfigProviderProps } from './UiConfigProvider.types';

defineOptions({ name: 'UiConfigProvider' });

const props = defineProps<UiConfigProviderProps>();
provideUiLocale(toRef(props, 'locale'));
</script>

<template>
  <slot />
</template>
