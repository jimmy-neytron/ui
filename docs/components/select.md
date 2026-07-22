<script setup>
import { ref } from 'vue';
import { UiSelect } from '@compact-ui';
const value = ref(null);
const values = ref([]);
const options = [
  { label: 'Vue', value: 'vue' }, { label: 'TypeScript', value: 'ts' },
  { label: 'Недоступно', value: 'off', disabled: true },
];
</script>

# Select

Combobox для одиночного/множественного выбора и локального поиска.

<DemoFrame title="Одиночный выбор">
  <UiSelect v-model="value" :options="options" label="Технология" clearable />
</DemoFrame>
<DemoFrame title="Множественный выбор">
  <UiSelect v-model="values" :options="options" label="Стек" multiple searchable clearable />
</DemoFrame>

## Props

| Prop | Тип | Default | Описание |
|---|---|---|---|
| `modelValue` | `TValue \| null \| TValue[]` | — | Значение |
| `options` | `readonly UiSelectOption[]` | обязательный | Опции |
| `multiple`, `searchable`, `clearable`, `disabled`, `loading` | `boolean` | `false` | Режимы |
| `error`, `label`, `hint` | `string` | — | Тексты поля |
| `placeholder` | `string` | `'Select an option'` | Placeholder |
| `searchPlaceholder` | `string` | `'Search options'` | Placeholder поиска |
| `noOptionsText` | `string` | `'No options'` | Нет опций |
| `noResultsText` | `string` | `'No results'` | Нет результатов |
| `name` | `string` | — | Hidden inputs для формы |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер |
| `closeOnSelect` | `boolean` | `!multiple` | Закрытие после выбора |
| `maxMenuHeight` | `string \| number` | CSS token | Number трактуется как px |

```ts
type UiSelectValue = string | number;
interface UiSelectOption<TValue extends UiSelectValue = UiSelectValue> {
  label: string;
  value: TValue;
  disabled?: boolean;
}
```

## События

`update:modelValue`, `open`, `close`, `search(string)`, `clear`, `focus(FocusEvent)`, `blur(FocusEvent)`.

## Слоты

| Слот | Props |
|---|---|
| `selected` | `{ options, values }` |
| `option` | `{ option, selected }` |
| `empty` | `{ searchQuery }` |
| `loading`, `prefix`, `suffix` | — |

Поиск локальный и регистронезависимый. Меню без Teleport/collision detection; родитель с `overflow: hidden` может его обрезать.
