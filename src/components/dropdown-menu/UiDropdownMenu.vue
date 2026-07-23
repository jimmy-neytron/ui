<script setup lang="ts" generic="TValue extends UiDropdownMenuValue = UiDropdownMenuValue">
import { nextTick, ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import { useStableId } from '../../composables/useStableId';
import type { UiDropdownMenuProps, UiDropdownMenuValue } from './UiDropdownMenu.types';
defineOptions({ name: 'UiDropdownMenu' });
const props = withDefaults(defineProps<UiDropdownMenuProps<TValue>>(), { modelValue: false, placement: 'bottom', disabled: false });
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; select: [value: TValue]; open: []; close: [] }>();
const root = ref<HTMLElement | null>(null); const itemRefs = ref<HTMLElement[]>([]); const id = useStableId('menu');
function setOpen(value: boolean) { if (props.disabled || value === props.modelValue) return; emit('update:modelValue', value); if (value) emit('open'); else emit('close'); if (value) void nextTick(() => itemRefs.value.find((item) => !item.hasAttribute('aria-disabled'))?.focus()); }
function select(item: UiDropdownMenuProps<TValue>['items'][number]) { if (item.disabled) return; emit('select', item.value); setOpen(false); }
function keydown(event: KeyboardEvent, index: number) {
  const enabled = itemRefs.value.filter((item) => !item.hasAttribute('aria-disabled'));
  if (!enabled.length) return;
  const position = enabled.indexOf(itemRefs.value[index] as HTMLElement);
  if (event.key === 'ArrowDown') { event.preventDefault(); enabled[(position + 1) % enabled.length]?.focus(); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); enabled[(position - 1 + enabled.length) % enabled.length]?.focus(); }
  else if (event.key === 'Home') { event.preventDefault(); enabled[0]?.focus(); }
  else if (event.key === 'End') { event.preventDefault(); enabled[enabled.length - 1]?.focus(); }
  else if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
}
useClickOutside(root, () => setOpen(false));
</script>
<template>
  <span ref="root" class="cui-overlay-anchor">
    <span class="cui-overlay-trigger" @click="setOpen(!modelValue)" @keydown.down.prevent="setOpen(true)"><slot name="trigger" /></span>
    <div v-if="modelValue" :id="id" class="cui-menu" role="menu" :data-placement="placement">
      <template v-for="(item, index) in items" :key="item.value">
        <a v-if="item.href" :ref="(element) => { if (element) itemRefs[index] = element as HTMLElement }" class="cui-menu__item" role="menuitem" :href="item.disabled ? undefined : item.href" :aria-disabled="item.disabled || undefined" :data-danger="item.danger || undefined" tabindex="-1" @click="item.disabled ? $event.preventDefault() : select(item)" @keydown="keydown($event, index)"><slot name="item" :item="item">{{ item.label }}</slot></a>
        <button v-else :ref="(element) => { if (element) itemRefs[index] = element as HTMLElement }" class="cui-menu__item" role="menuitem" type="button" :disabled="item.disabled" :data-danger="item.danger || undefined" tabindex="-1" @click="select(item)" @keydown="keydown($event, index)"><slot name="item" :item="item">{{ item.label }}</slot></button>
      </template>
    </div>
  </span>
</template>
