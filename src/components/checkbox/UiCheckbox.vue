<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiCheckboxProps } from './UiCheckbox.types';

defineOptions({ name: 'UiCheckbox', inheritAttrs: false });

withDefaults(defineProps<UiCheckboxProps>(), {
  modelValue: false,
  disabled: false,
  required: false,
  indeterminate: false,
  value: 'on',
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [event: Event];
}>();

const attrs = useAttrs();
const inputId = useStableId('checkbox', () =>
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
    class="cui-choice cui-checkbox"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :data-checked="modelValue || undefined"
    :data-indeterminate="indeterminate || undefined"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="cui-choice__native"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :indeterminate="indeterminate"
      :name="name"
      :value="value"
      :aria-describedby="description ? descriptionId : undefined"
      @change="handleChange"
    />
    <span class="cui-choice__control" aria-hidden="true">
      <span class="cui-checkbox__mark" />
    </span>
    <span v-if="label || description || $slots.default" class="cui-choice__content">
      <span class="cui-choice__label"><slot>{{ label }}</slot></span>
      <span v-if="description" :id="descriptionId" class="cui-choice__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>
