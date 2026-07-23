<script setup>
import { ref } from 'vue';
import { UiRadio } from '@compact-ui';

const plan = ref('pro');
const numberValue = ref(2);
</script>

# Radio

Типизированная radio-опция для controlled-групп.

## Группа и описания

<DemoFrame title="modelValue, value, name, label, description">
  <div class="demo-stack">
    <UiRadio v-model="plan" value="basic" name="plan" label="Basic" />
    <UiRadio v-model="plan" value="pro" name="plan" label="Pro" description="Для продуктовых команд" />
    <UiRadio v-model="plan" value="enterprise" name="plan" label="Enterprise" />
  </div>
</DemoFrame>

## Числовые значения и slot

<DemoFrame title="number value, default slot">
  <div class="demo-stack">
    <UiRadio v-model="numberValue" :value="1" name="priority">Низкий приоритет</UiRadio>
    <UiRadio v-model="numberValue" :value="2" name="priority">Средний приоритет</UiRadio>
    <UiRadio v-model="numberValue" :value="3" name="priority">Высокий приоритет</UiRadio>
  </div>
</DemoFrame>

## Состояния и размеры

<DemoFrame title="disabled, required, size">
  <div class="demo-stack">
    <UiRadio value="sm" size="sm" label="Small" />
    <UiRadio value="md" size="md" label="Medium" required />
    <UiRadio value="lg" size="lg" label="Large" />
    <UiRadio value="disabled" label="Disabled" disabled />
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `TValue \| null` | — |
| `value` | `string \| number` | обязательный |
| `label`, `description` | `string` | — |
| `disabled`, `required` | `boolean` | `false` |
| `name` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

События: `update:modelValue`, `change`. Default slot заменяет label.
