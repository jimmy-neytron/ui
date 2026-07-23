<script setup lang="ts">
import { computed } from 'vue';
import { useUiLocale } from '../../config/locale';
import type { UiPaginationProps } from './UiPagination.types';
defineOptions({ name: 'UiPagination' });
const props = withDefaults(defineProps<UiPaginationProps>(), { modelValue: 1, pageSize: 10, siblingCount: 1, disabled: false, size: 'md', ariaLabel: 'Pagination' });
const emit = defineEmits<{ 'update:modelValue': [page: number]; change: [page: number] }>();
const locale = useUiLocale();
const pageCount = computed(() => Math.max(1, Math.ceil(Math.max(0, props.total) / Math.max(1, props.pageSize))));
const current = computed(() => Math.min(pageCount.value, Math.max(1, props.modelValue)));
const pages = computed<(number | 'ellipsis-start' | 'ellipsis-end')[]>(() => {
  const count = pageCount.value;
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);
  const start = Math.max(2, current.value - props.siblingCount);
  const end = Math.min(count - 1, current.value + props.siblingCount);
  const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
  if (start > 2) result.push('ellipsis-start');
  for (let page = start; page <= end; page += 1) result.push(page);
  if (end < count - 1) result.push('ellipsis-end');
  result.push(count);
  return result;
});
function select(page: number) {
  if (props.disabled || page === current.value || page < 1 || page > pageCount.value) return;
  emit('update:modelValue', page);
  emit('change', page);
}
</script>
<template>
  <nav class="cui-pagination" :data-size="size" :aria-label="ariaLabel">
    <button type="button" class="cui-pagination__button" :disabled="disabled || current <= 1" :aria-label="locale.previousPage" @click="select(current - 1)">‹</button>
    <template v-for="page in pages" :key="page">
      <span v-if="typeof page !== 'number'" class="cui-pagination__ellipsis" aria-hidden="true">…</span>
      <button v-else type="button" class="cui-pagination__button" :data-current="page === current || undefined" :aria-current="page === current ? 'page' : undefined" :disabled="disabled" :aria-label="`Page ${page}`" @click="select(page)">{{ page }}</button>
    </template>
    <button type="button" class="cui-pagination__button" :disabled="disabled || current >= pageCount" :aria-label="locale.nextPage" @click="select(current + 1)">›</button>
  </nav>
</template>
