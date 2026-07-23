<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiSwitchProps } from './UiSwitch.types';

defineOptions({ name: 'UiSwitch', inheritAttrs: false });

withDefaults(defineProps<UiSwitchProps>(), {
  modelValue: false,
  disabled: false,
  required: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [event: Event];
}>();

const attrs = useAttrs();
const inputId = useStableId('switch', () =>
  typeof attrs.id === 'string' ? attrs.id : undefined,
);
const descriptionId = computed(() => inputId.value + '-description');

function handleChange(event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    emit('update:modelValue', target.checked);
    emit('change', event);
  }
}
</script>

<template>
  <label
    class="cui-switch"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :data-checked="modelValue || undefined"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="cui-switch__native"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :name="name"
      :aria-describedby="description ? descriptionId : undefined"
      @change="handleChange"
    />
    <span class="cui-switch__track" aria-hidden="true">
      <span class="cui-switch__thumb" />
    </span>
    <span v-if="label || description || $slots.default" class="cui-switch__content">
      <span class="cui-switch__label"><slot>{{ label }}</slot></span>
      <span v-if="description" :id="descriptionId" class="cui-switch__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>
