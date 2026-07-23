<script setup lang="ts" generic="TValue extends UiTabsValue = UiTabsValue">
import { nextTick, ref } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiTabsProps, UiTabsValue } from './UiTabs.types';
defineOptions({ name: 'UiTabs' });
const props = withDefaults(defineProps<UiTabsProps<TValue>>(), { orientation: 'horizontal', activation: 'automatic', ariaLabel: 'Tabs' });
const emit = defineEmits<{ 'update:modelValue': [value: TValue]; change: [value: TValue] }>();
const id = useStableId('tabs');
const tabRefs = ref<HTMLButtonElement[]>([]);
function select(value: TValue) { if (value === props.modelValue) return; emit('update:modelValue', value); emit('change', value); }
function focusAt(index: number) {
  const enabled = props.items.map((item, itemIndex) => ({ item, itemIndex })).filter(({ item }) => !item.disabled);
  if (!enabled.length) return;
  const target = enabled[(index + enabled.length) % enabled.length] as typeof enabled[number];
  void nextTick(() => tabRefs.value[target.itemIndex]?.focus());
  if (props.activation === 'automatic') select(target.item.value);
}
function keydown(event: KeyboardEvent, index: number) {
  const horizontal = props.orientation === 'horizontal';
  const previous = horizontal ? 'ArrowLeft' : 'ArrowUp';
  const next = horizontal ? 'ArrowRight' : 'ArrowDown';
  const enabledIndexes = props.items.map((item, i) => item.disabled ? -1 : i).filter((i) => i >= 0);
  const position = enabledIndexes.indexOf(index);
  if (event.key === previous) { event.preventDefault(); focusAt(position - 1); }
  else if (event.key === next) { event.preventDefault(); focusAt(position + 1); }
  else if (event.key === 'Home') { event.preventDefault(); focusAt(0); }
  else if (event.key === 'End') { event.preventDefault(); focusAt(enabledIndexes.length - 1); }
  else if ((event.key === 'Enter' || event.key === ' ') && props.activation === 'manual') { event.preventDefault(); const item = props.items[index]; if (item && !item.disabled) select(item.value); }
}
</script>
<template>
  <div class="cui-tabs" :data-orientation="orientation">
    <div class="cui-tabs__list" role="tablist" :aria-label="ariaLabel" :aria-orientation="orientation">
      <button v-for="(item, index) in items" :id="`${id}-tab-${index}`" :key="item.value" :ref="(element) => { if (element) tabRefs[index] = element as HTMLButtonElement }" class="cui-tabs__tab" type="button" role="tab" :aria-selected="item.value === modelValue" :aria-controls="`${id}-panel-${index}`" :tabindex="item.value === modelValue ? 0 : -1" :disabled="item.disabled" @click="select(item.value)" @keydown="keydown($event, index)">
        <slot name="tab" :item="item" :selected="item.value === modelValue">{{ item.label }}</slot>
      </button>
    </div>
    <div v-for="(item, index) in items" v-show="item.value === modelValue" :id="`${id}-panel-${index}`" :key="item.value" class="cui-tabs__panel" role="tabpanel" :aria-labelledby="`${id}-tab-${index}`" tabindex="0">
      <slot name="panel" :item="item">{{ item.panel }}</slot>
    </div>
  </div>
</template>
