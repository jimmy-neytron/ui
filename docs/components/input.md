<script setup>
import { ref } from 'vue';
import { UiInput } from '@compact-ui';

const email = ref('team@example.com');
const amount = ref(10);
const code = ref('CUI-021');
const clearValue = ref('Удалите меня');
</script>

# Input

Controlled-поле для строк, чисел и native input-возможностей.

## Размеры

<DemoFrame title="size">
  <div class="demo-stack">
    <UiInput size="sm" label="Small" placeholder="sm" />
    <UiInput size="md" label="Medium" placeholder="md" />
    <UiInput size="lg" label="Large" placeholder="lg" />
  </div>
</DemoFrame>

## Label, hint, error и placeholder

<DemoFrame title="label, hint, error, placeholder">
  <div class="demo-stack">
    <UiInput v-model="email" label="Email" hint="Используйте рабочий адрес" placeholder="name@example.com" />
    <UiInput label="Email с ошибкой" error="Введите корректный адрес" model-value="wrong" />
  </div>
</DemoFrame>

## Состояния

<DemoFrame title="disabled, readonly, required, clearable">
  <div class="demo-stack">
    <UiInput label="Disabled" model-value="Нельзя изменить" disabled />
    <UiInput label="Readonly" model-value="Только чтение" readonly />
    <UiInput label="Required" required placeholder="Обязательное поле" />
    <UiInput v-model="clearValue" label="Clearable" clearable />
  </div>
</DemoFrame>

## Тип, ограничения и форма

<DemoFrame title="type, name, autocomplete, inputmode, min, max, step, maxlength, pattern">
  <div class="demo-stack">
    <UiInput
      v-model="amount"
      type="number"
      label="Количество"
      name="amount"
      inputmode="decimal"
      :min="0"
      :max="100"
      :step="5"
      required
    />
    <UiInput
      v-model="code"
      label="Код"
      name="product-code"
      autocomplete="off"
      :maxlength="12"
      pattern="[A-Z0-9-]+"
      hint="Только A–Z, цифры и дефис; максимум 12 символов"
    />
  </div>
</DemoFrame>

## Prefix и suffix

<DemoFrame title="slots: prefix, suffix">
  <UiInput v-model="amount" type="number" label="Стоимость">
    <template #prefix>€</template>
    <template #suffix>EUR</template>
  </UiInput>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `string \| number` | `''` |
| `type` | native input type | `'text'` |
| `label`, `placeholder`, `hint`, `error` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled`, `readonly`, `required`, `clearable` | `boolean` | `false` |
| `name`, `autocomplete`, `pattern` | `string` | — |
| `inputmode` | native inputmode | — |
| `min`, `max`, `step` | `string \| number` | — |
| `maxlength` | `number` | — |

События: `update:modelValue`, `focus`, `blur`, `change`, `clear`. Слоты: `prefix`, `suffix`.
