<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import IconClose from '../../internal/icons/IconClose.vue';
import { useStableId } from '../../composables/useStableId';
import { useUiLocale } from '../../config/locale';
import type { UiInputModelValue, UiInputProps } from './UiInput.types';

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UiInputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: UiInputModelValue];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  change: [event: Event];
  clear: [];
}>();

const attrs = useAttrs();
const locale = useUiLocale();
const inputRef = ref<HTMLInputElement | null>(null);
const inputId = useStableId('input', () =>
  typeof attrs.id === 'string' ? attrs.id : undefined,
);
const hintId = computed(() => `${inputId.value}-hint`);
const errorId = computed(() => `${inputId.value}-error`);

const describedBy = computed(() => {
  const ids = [
    typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined,
    props.hint && !props.error ? hintId.value : undefined,
    props.error ? errorId.value : undefined,
  ].filter((value): value is string => Boolean(value));

  return ids.length > 0 ? ids.join(' ') : undefined;
});

const hasValue = computed(() => String(props.modelValue).length > 0);

function normalizeValue(element: HTMLInputElement): UiInputModelValue {
  if (props.type === 'number' && element.value !== '') {
    return element.valueAsNumber;
  }

  return element.value;
}

function handleInput(event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    emit('update:modelValue', normalizeValue(target));
  }
}

function clearValue() {
  if (props.disabled || props.readonly) {
    return;
  }

  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
}
</script>

<template>
  <div
    class="cui-field cui-input"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :data-invalid="Boolean(error) || undefined"
  >
    <label v-if="label" class="cui-field__label" :for="inputId">
      {{ label }}
      <span v-if="required" class="cui-field__required" aria-hidden="true">*</span>
    </label>

    <div class="cui-input__control">
      <span v-if="$slots.prefix" class="cui-input__affix" aria-hidden="true">
        <slot name="prefix" />
      </span>

      <input
        v-bind="attrs"
        :id="inputId"
        ref="inputRef"
        class="cui-input__native"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        :pattern="pattern"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="handleInput"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @change="emit('change', $event)"
      />

      <button
        v-if="clearable && hasValue"
        class="cui-input__clear"
        type="button"
        :aria-label="locale.clearInput"
        :disabled="disabled || readonly"
        @click="clearValue"
      >
        <IconClose />
      </button>

      <span v-if="$slots.suffix" class="cui-input__affix" aria-hidden="true">
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="error" :id="errorId" class="cui-field__message cui-field__message--error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="cui-field__message">
      {{ hint }}
    </p>
  </div>
</template>
