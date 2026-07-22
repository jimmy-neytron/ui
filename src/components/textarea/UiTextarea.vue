<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiTextareaProps } from './UiTextarea.types';

defineOptions({
  name: 'UiTextarea',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UiTextareaProps>(), {
  modelValue: '',
  rows: 4,
  showCount: false,
  resize: 'vertical',
  autoResize: false,
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  change: [event: Event];
}>();

const attrs = useAttrs();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const textareaId = useStableId('textarea', () =>
  typeof attrs.id === 'string' ? attrs.id : undefined,
);
const hintId = computed(() => `${textareaId.value}-hint`);
const errorId = computed(() => `${textareaId.value}-error`);
const countId = computed(() => `${textareaId.value}-count`);
const characterCount = computed(() => props.modelValue.length);

const describedBy = computed(() => {
  const ids = [
    typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined,
    props.hint && !props.error ? hintId.value : undefined,
    props.error ? errorId.value : undefined,
    props.showCount ? countId.value : undefined,
  ].filter((value): value is string => Boolean(value));

  return ids.length > 0 ? ids.join(' ') : undefined;
});

function resizeToContent() {
  if (!props.autoResize || !textareaRef.value) {
    return;
  }

  textareaRef.value.style.height = 'auto';
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
}

function handleInput(event: Event) {
  const target = event.target;
  if (target instanceof HTMLTextAreaElement) {
    emit('update:modelValue', target.value);
    void nextTick(resizeToContent);
  }
}

watch(
  () => [props.modelValue, props.autoResize] as const,
  () => {
    void nextTick(() => {
      if (!props.autoResize && textareaRef.value) {
        textareaRef.value.style.height = '';
        return;
      }

      resizeToContent();
    });
  },
);

onMounted(() => {
  resizeToContent();
});
</script>

<template>
  <div
    class="cui-field cui-textarea"
    :data-disabled="disabled || undefined"
    :data-invalid="Boolean(error) || undefined"
  >
    <label v-if="label" class="cui-field__label" :for="textareaId">
      {{ label }}
      <span v-if="required" class="cui-field__required" aria-hidden="true">*</span>
    </label>

    <textarea
      v-bind="attrs"
      :id="textareaId"
      ref="textareaRef"
      class="cui-textarea__native"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      :data-auto-resize="autoResize || undefined"
      :style="{ resize: autoResize ? 'none' : resize }"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    />

    <div v-if="error || hint || showCount" class="cui-textarea__footer">
      <p v-if="error" :id="errorId" class="cui-field__message cui-field__message--error">
        {{ error }}
      </p>
      <p v-else-if="hint" :id="hintId" class="cui-field__message">
        {{ hint }}
      </p>
      <span v-else />

      <span v-if="showCount" :id="countId" class="cui-textarea__count" aria-live="polite">
        {{ characterCount }}<template v-if="maxlength"> / {{ maxlength }}</template>
      </span>
    </div>
  </div>
</template>
