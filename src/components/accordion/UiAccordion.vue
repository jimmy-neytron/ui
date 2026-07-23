<script setup lang="ts" generic="TValue extends UiAccordionValue = UiAccordionValue">
import { useStableId } from '../../composables/useStableId';
import type { UiAccordionProps, UiAccordionValue } from './UiAccordion.types';
defineOptions({ name: 'UiAccordion' });
const props = withDefaults(defineProps<UiAccordionProps<TValue>>(), { modelValue: null, multiple: false, collapsible: true });
const emit = defineEmits<{ 'update:modelValue': [value: TValue | TValue[] | null]; change: [value: TValue | TValue[] | null] }>();
const id = useStableId('accordion');
function open(value: TValue) { return Array.isArray(props.modelValue) ? props.modelValue.includes(value) : props.modelValue === value; }
function toggle(value: TValue, disabled?: boolean) {
  if (disabled) return;
  let next: TValue | TValue[] | null;
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] as TValue[] : [];
    next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  } else next = open(value) && props.collapsible ? null : value;
  emit('update:modelValue', next); emit('change', next);
}
</script>
<template>
  <div class="cui-accordion">
    <section
      v-for="(item, index) in items"
      :key="item.value"
      class="cui-accordion__item"
      :data-open="open(item.value) || undefined"
      :data-disabled="item.disabled || undefined"
    >
      <h3 class="cui-accordion__heading">
        <button
          :id="`${id}-trigger-${index}`"
          class="cui-accordion__trigger"
          type="button"
          :disabled="item.disabled"
          :aria-expanded="open(item.value)"
          :aria-controls="`${id}-panel-${index}`"
          @click="toggle(item.value, item.disabled)"
        >
          <span class="cui-accordion__title">
            <slot name="title" :item="item" :open="open(item.value)">{{ item.title }}</slot>
          </span>
          <span class="cui-accordion__icon" aria-hidden="true">
            <slot name="icon" :item="item" :open="open(item.value)">
              <svg viewBox="0 0 20 20" fill="none" focusable="false">
                <path d="m6.25 8 3.75 3.75L13.75 8" />
              </svg>
            </slot>
          </span>
        </button>
      </h3>
      <div
        v-show="open(item.value)"
        :id="`${id}-panel-${index}`"
        class="cui-accordion__panel"
        role="region"
        :aria-labelledby="`${id}-trigger-${index}`"
      >
        <div class="cui-accordion__content">
          <slot name="item" :item="item">{{ item.content }}</slot>
        </div>
      </div>
    </section>
  </div>
</template>