<script setup>
import { ref } from 'vue';
import { UiInput } from '@compact-ui';
const email = ref('');
</script>

# Input

Controlled-поле для строк и чисел.

<DemoFrame title="Пример">
  <UiInput v-model="email" type="email" label="Email" hint="Рабочий адрес" clearable />
</DemoFrame>

## Props

| Prop | Тип | Default | Описание |
|---|---|---|---|
| `modelValue` | `string \| number` | `''` | Controlled-значение |
| `type` | native input type | `'text'` | Тип input |
| `label`, `placeholder`, `hint`, `error` | `string` | — | Тексты поля |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер |
| `disabled`, `readonly`, `required`, `clearable` | `boolean` | `false` | Состояния |
| `name`, `autocomplete`, `pattern` | `string` | — | Native attrs |
| `inputmode` | native inputmode | — | Мобильная клавиатура |
| `min`, `max`, `step` | `string \| number` | — | Числовые ограничения |
| `maxlength` | `number` | — | Максимальная длина |

Остальные attrs попадают на native `input`. Для `type="number"` непустое значение эмитится как number, пустое — `''`.

## События

| Событие | Payload |
|---|---|
| `update:modelValue` | `string \| number` |
| `focus`, `blur` | `FocusEvent` |
| `change` | `Event` |
| `clear` | — |

## Слоты

`prefix` и `suffix`.

```vue
<UiInput v-model="amount" type="number" :min="0">
  <template #prefix>€</template><template #suffix>EUR</template>
</UiInput>
```
