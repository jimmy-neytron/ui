<script setup lang="ts">
import { ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import { useStableId } from '../../composables/useStableId';
import type { UiPopoverProps } from './UiPopover.types';

defineOptions({ name: 'UiPopover' });

const props = withDefaults(defineProps<UiPopoverProps>(), {
  modelValue: false,
  placement: 'bottom',
  disabled: false,
  closeOnEscape: true,
  closeOnOutside: true,
});
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  open: [];
  close: [];
}>();
const root = ref<HTMLElement | null>(null);
const id = useStableId('popover');

function setOpen(value: boolean) {
  if (props.disabled || value === props.modelValue) return;
  emit('update:modelValue', value);
  if (value) emit('open');
  else emit('close');
}

function escape() {
  if (props.closeOnEscape) setOpen(false);
}

useClickOutside(root, () => {
  if (props.closeOnOutside) setOpen(false);
});
</script>

<template>
  <span ref="root" class="cui-overlay-anchor" @keydown.esc.prevent="escape">
    <span class="cui-overlay-trigger" @click="setOpen(!modelValue)">
      <slot name="trigger" :open="modelValue" :disabled="disabled" />
    </span>
    <div v-if="modelValue" :id="id" class="cui-popover" :data-placement="placement">
      <span class="cui-popover__arrow" aria-hidden="true" />
      <div class="cui-popover__content"><slot /></div>
    </div>
  </span>
</template>