<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import { useUiLocale } from '../../config/locale';
import type { UiToastProps } from './UiToast.types';

defineOptions({ name: 'UiToast' });

const props = withDefaults(defineProps<UiToastProps>(), {
  modelValue: true,
  tone: 'neutral',
  duration: 5000,
  dismissible: true,
});
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();
const locale = useUiLocale();
let timer: ReturnType<typeof setTimeout> | undefined;

function stop() {
  clearTimeout(timer);
  timer = undefined;
}

function start() {
  stop();
  if (props.modelValue && props.duration > 0) timer = setTimeout(close, props.duration);
}

function close() {
  stop();
  emit('update:modelValue', false);
  emit('close');
}

watch(() => [props.modelValue, props.duration], start, { immediate: true });
onBeforeUnmount(stop);
</script>

<template>
  <article
    v-if="modelValue"
    class="cui-toast"
    :data-tone="tone"
    role="status"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <div class="cui-toast__content">
      <strong v-if="title" class="cui-toast__title">{{ title }}</strong>
      <div v-if="description || $slots.default" class="cui-toast__description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      class="cui-toast__close"
      type="button"
      :aria-label="closeLabel ?? locale.close"
      @click="close"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <path d="m5.5 5.5 9 9m0-9-9 9" />
      </svg>
    </button>
  </article>
</template>