<script setup lang="ts">
import { useAttrs } from 'vue';
import type { UiAlertProps } from './UiAlert.types';
import { useUiLocale } from '../../config/locale';

defineOptions({ name: 'UiAlert', inheritAttrs: false });

withDefaults(defineProps<UiAlertProps>(), {
  tone: 'info',
  variant: 'soft',
  dismissible: false,
  role: 'status',
});

const emit = defineEmits<{
  dismiss: [event: MouseEvent];
}>();

const attrs = useAttrs();
const locale = useUiLocale();
</script>

<template>
  <div
    v-bind="attrs"
    class="cui-alert"
    :data-tone="tone"
    :data-variant="variant"
    :role="role"
  >
    <span v-if="$slots.icon" class="cui-alert__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <div class="cui-alert__content">
      <div v-if="title || $slots.title" class="cui-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="cui-alert__message"><slot /></div>
      <div v-if="$slots.actions" class="cui-alert__actions">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="dismissible"
      class="cui-alert__dismiss"
      type="button"
      :aria-label="dismissLabel ?? locale.dismiss"
      @click="emit('dismiss', $event)"
    >
      <slot name="close">×</slot>
    </button>
  </div>
</template>
