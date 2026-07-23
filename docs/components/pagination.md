<script setup>
import { ref } from 'vue'; import { UiPagination } from '@compact-ui';
const page = ref(8); const small = ref(1);
</script>
# Pagination
Контролируемая пагинация с адаптивными диапазонами страниц.
## Диапазон и размеры
<DemoFrame title="modelValue, total, pageSize, siblingCount, size, ariaLabel, disabled">
  <div class="demo-stack"><UiPagination v-model="page" :total="240" :page-size="10" :sibling-count="2" size="lg" aria-label="Страницы каталога" /><UiPagination v-model="small" :total="30" :page-size="10" size="sm" /><UiPagination :total="30" disabled /></div>
</DemoFrame>
## Props
<ApiTable component="UiPaginationProps" />
События: `update:modelValue`, `change`.