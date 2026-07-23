<script setup lang="ts" generic="TValue extends UiRadioValue = UiRadioValue">
import { computed, useAttrs } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiRadioProps, UiRadioValue } from './UiRadio.types';

defineOptions({ name: 'UiRadio', inheritAttrs: false });

const props = withDefaults(defineProps<UiRadioProps<TValue>>(), {
  disabled: false,
  required: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: TValue];
  change: [event: Event];
}>();

const attrs = useAttrs();
const inputId = useStableId('radio', () =>
  typeof attrs.id === 'string' ? attrs.id : undefined,
);
const descriptionId = computed(() => inputId.value + '-description');
const isChecked = computed(() => Object.is(props.modelValue, props.value));

function handleChange(event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.checked) {
    emit('update:modelValue', props.value);
    emit('change', event);
  }
}
</script>

<template>
  <label
    class="cui-choice cui-radio"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :data-checked="isChecked || undefined"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="cui-choice__native"
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      :name="name"
      :value="value"
      :aria-describedby="description ? descriptionId : undefined"
      @change="handleChange"
    />
    <span class="cui-choice__control" aria-hidden="true">
      <span class="cui-radio__mark" />
    </span>
    <span v-if="label || description || $slots.default" class="cui-choice__content">
      <span class="cui-choice__label"><slot>{{ label }}</slot></span>
      <span v-if="description" :id="descriptionId" class="cui-choice__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>
