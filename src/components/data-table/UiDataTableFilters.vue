<script
  setup
  lang="ts"
  generic="TRow extends object = Record<string, unknown>"
>
import { computed, ref, watch } from 'vue';
import UiButton from '../button/UiButton.vue';
import UiDialog from '../dialog/UiDialog.vue';
import UiInput from '../input/UiInput.vue';
import UiSelect from '../select/UiSelect.vue';
import type { UiSelectModelValue } from '../select';
import { defaultUiDataTableLabels } from './dataTableLabels';
import type {
  UiDataTableFilterValues,
  UiDataTableFiltersProps,
  UiDataTableNumberRange,
} from './UiDataTable.types';

defineOptions({ name: 'UiDataTableFilters' });

const props = withDefaults(defineProps<UiDataTableFiltersProps<TRow>>(), {
  modelValue: false,
  filters: () => ({}),
  teleport: true,
});
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  apply: [filters: UiDataTableFilterValues];
  reset: [];
}>();

const draftFilters = ref<UiDataTableFilterValues>({});
const filterColumns = computed(() => props.columns.filter((column) => column.filter));
const labels = computed(() => ({ ...defaultUiDataTableLabels, ...props.labels }));

function cloneFilters(filters: UiDataTableFilterValues | undefined) {
  return Object.fromEntries(
    Object.entries(filters ?? {}).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? [...value]
        : value && typeof value === 'object'
          ? { ...value }
          : value,
    ]),
  );
}

function close() {
  emit('update:modelValue', false);
}

function setFilter(key: string, value: unknown) {
  draftFilters.value = { ...draftFilters.value, [key]: value };
}

function textValue(key: string) {
  const value = draftFilters.value[key];
  return typeof value === 'string' || typeof value === 'number' ? value : '';
}

function selectValue(key: string, multiple: boolean | undefined): UiSelectModelValue {
  const value = draftFilters.value[key];
  if (multiple) return Array.isArray(value) ? value as UiSelectModelValue : [];
  return typeof value === 'string' || typeof value === 'number' ? value : null;
}

function rangeValue(key: string): UiDataTableNumberRange {
  const value = draftFilters.value[key];
  return value && typeof value === 'object' ? value as UiDataTableNumberRange : {};
}

function setRangeBound(key: string, bound: keyof UiDataTableNumberRange, value: string | number) {
  const range = rangeValue(key);
  const normalized = value === '' ? undefined : Number(value);
  setFilter(key, { ...range, [bound]: normalized });
}

function reset() {
  draftFilters.value = {};
  emit('reset');
}

function apply() {
  emit('apply', cloneFilters(draftFilters.value));
  close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) draftFilters.value = cloneFilters(props.filters);
  },
  { immediate: true },
);
</script>

<template>
  <UiDialog
    :model-value="modelValue"
    :title="labels.filterDialogTitle"
    :description="labels.filterDialogDescription"
    size="md"
    :teleport="teleport"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="cui-data-table-filters">
      <div
        v-for="column in filterColumns"
        :key="column.key"
        class="cui-data-table-filters__field"
      >
        <slot
          name="filter"
          :column="column"
          :value="draftFilters[column.key]"
          :set-value="(value: unknown) => setFilter(column.key, value)"
          :filters="draftFilters"
        >
          <UiInput
            v-if="column.filter?.type === 'text'"
            :model-value="textValue(column.key)"
            :label="column.filter.label ?? column.label"
            :placeholder="column.filter.placeholder ?? ''"
            clearable
            @update:model-value="setFilter(column.key, $event)"
          />

          <UiSelect
            v-else-if="column.filter?.type === 'select'"
            :model-value="selectValue(column.key, column.filter.multiple)"
            :options="column.filter.options"
            :label="column.filter.label ?? column.label"
            :placeholder="column.filter.placeholder ?? ''"
            :multiple="column.filter.multiple ?? false"
            :searchable="column.filter.searchable ?? false"
            clearable
            @update:model-value="setFilter(column.key, $event)"
          />

          <fieldset
            v-else-if="column.filter?.type === 'number-range'"
            class="cui-data-table-filters__range"
          >
            <legend>{{ column.filter.label ?? column.label }}</legend>
            <UiInput
              type="number"
              :model-value="rangeValue(column.key).min ?? ''"
              :label="labels.minimum"
              :min="column.filter.min ?? ''"
              :max="column.filter.max ?? ''"
              :step="column.filter.step ?? ''"
              @update:model-value="setRangeBound(column.key, 'min', $event)"
            />
            <UiInput
              type="number"
              :model-value="rangeValue(column.key).max ?? ''"
              :label="labels.maximum"
              :min="column.filter.min ?? ''"
              :max="column.filter.max ?? ''"
              :step="column.filter.step ?? ''"
              @update:model-value="setRangeBound(column.key, 'max', $event)"
            />
          </fieldset>
        </slot>
      </div>
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="reset">
        {{ labels.resetFilters }}
      </UiButton>
      <UiButton @click="apply">
        {{ labels.applyFilters }}
      </UiButton>
    </template>
  </UiDialog>
</template>
