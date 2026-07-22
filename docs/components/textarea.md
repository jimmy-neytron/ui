<script setup>
import { ref } from 'vue';
import { UiTextarea } from '@compact-ui';
const description = ref('Короткое описание продукта.');
</script>

# Textarea

Многострочное controlled-поле со счётчиком и автоматической высотой.

<DemoFrame title="Пример">
  <UiTextarea v-model="description" label="Описание" :maxlength="160" show-count auto-resize />
</DemoFrame>

## Props

| Prop | Тип | Default | Описание |
|---|---|---|---|
| `modelValue` | `string` | `''` | Значение |
| `label`, `placeholder`, `hint`, `error` | `string` | — | Тексты |
| `rows` | `number` | `4` | Начальное число строк |
| `maxlength` | `number` | — | Максимальная длина |
| `showCount` | `boolean` | `false` | Счётчик |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Native resize |
| `autoResize` | `boolean` | `false` | Высота по содержимому |
| `disabled`, `readonly`, `required` | `boolean` | `false` | Состояния |
| `name` | `string` | — | Поле формы |

Дополнительные attrs передаются native `textarea`.

## События

| Событие | Payload |
|---|---|
| `update:modelValue` | `string` |
| `focus`, `blur` | `FocusEvent` |
| `change` | `Event` |

`autoResize` обращается к DOM только после mount, поэтому компонент SSR-safe.
