<script setup>
import { ref } from 'vue';
import { UiSelect } from '@compact-ui';

const single = ref(null);
const multiple = ref(['vue']);
const sized = ref('ts');
const custom = ref('vue');
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Vite', value: 'vite' },
  { label: 'Недоступно', value: 'disabled', disabled: true },
];
</script>

# Select

Combobox для одиночного/множественного выбора, поиска и форм.

## Одиночный выбор

<DemoFrame title="modelValue, options, label, hint, placeholder, clearable, name">
  <UiSelect
    v-model="single"
    :options="options"
    label="Технология"
    hint="Можно выбрать один вариант"
    placeholder="Выберите технологию"
    name="technology"
    clearable
  />
</DemoFrame>

## Multiple и search

<DemoFrame title="multiple, searchable, searchPlaceholder, closeOnSelect, maxMenuHeight">
  <UiSelect
    v-model="multiple"
    :options="options"
    label="Стек"
    multiple
    searchable
    clearable
    search-placeholder="Найти в стеке"
    :close-on-select="false"
    :max-menu-height="140"
  />
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-stack">
    <UiSelect v-model="sized" :options="options" size="sm" label="Small" />
    <UiSelect v-model="sized" :options="options" size="md" label="Medium" />
    <UiSelect v-model="sized" :options="options" size="lg" label="Large" />
  </div>
</DemoFrame>

## Состояния

<DemoFrame title="disabled, loading, error">
  <div class="demo-stack">
    <UiSelect :options="options" label="Disabled" disabled placeholder="Недоступно" />
    <UiSelect :options="options" label="Loading" loading placeholder="Откройте меню" />
    <UiSelect :options="options" label="Ошибка" error="Выберите значение" />
  </div>
</DemoFrame>

## Пустые состояния

<DemoFrame title="noOptionsText, noResultsText">
  <div class="demo-stack">
    <UiSelect :options="[]" label="Без опций" no-options-text="Список пока пуст" />
    <UiSelect
      :options="options"
      label="Поиск без результата"
      searchable
      search-placeholder="Введите неизвестный вариант"
      no-results-text="Совпадений нет"
    />
  </div>
</DemoFrame>

## Слоты

<DemoFrame title="selected, option, empty, loading, prefix, suffix">
  <div class="demo-stack">
    <UiSelect v-model="custom" :options="options" label="Кастомный select">
      <template #prefix>◆</template>
      <template #selected="{ options: selected }">
        Выбрано: {{ selected.map((item) => item.label).join(', ') }}
      </template>
      <template #option="{ option, selected: isSelected }">
        <span>{{ isSelected ? '✓' : '○' }} {{ option.label }}</span>
      </template>
      <template #suffix>⌄</template>
    </UiSelect>
    <UiSelect :options="[]" label="Custom empty">
      <template #empty>Добавьте первый вариант</template>
    </UiSelect>
    <UiSelect :options="options" label="Custom loading" loading>
      <template #loading>Загружаем варианты…</template>
    </UiSelect>
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `TValue \| null \| TValue[]` | — |
| `options` | `readonly UiSelectOption[]` | обязательный |
| `multiple`, `searchable`, `clearable`, `disabled`, `loading` | `boolean` | `false` |
| `error`, `label`, `hint` | `string` | — |
| `placeholder` | `string` | `'Select an option'` |
| `searchPlaceholder` | `string` | `'Search options'` |
| `noOptionsText` | `string` | `'No options'` |
| `noResultsText` | `string` | `'No results'` |
| `name` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `closeOnSelect` | `boolean` | `!multiple` |
| `maxMenuHeight` | `string \| number` | CSS token |

События: `update:modelValue`, `open`, `close`, `search`, `clear`, `focus`, `blur`.
