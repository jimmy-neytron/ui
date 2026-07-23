<script setup>
import { ref } from 'vue';
import { UiCheckbox } from '@compact-ui';

const accepted = ref(false);
const partial = ref(false);
const feature = ref(true);
</script>

# Checkbox

Controlled checkbox с описанием, размерами и indeterminate-состоянием.

## Значения и текст

<DemoFrame title="modelValue, label, description">
  <div class="demo-stack">
    <UiCheckbox v-model="accepted" label="Принять условия" description="Обязательно для продолжения" />
    <UiCheckbox v-model="feature">
      Label через default slot
    </UiCheckbox>
  </div>
</DemoFrame>

## Состояния

<DemoFrame title="indeterminate, disabled, required">
  <div class="demo-stack">
    <UiCheckbox v-model="partial" label="Выбрана часть элементов" indeterminate />
    <UiCheckbox label="Недоступно" disabled />
    <UiCheckbox label="Обязательное согласие" required />
  </div>
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-stack">
    <UiCheckbox size="sm" label="Small" />
    <UiCheckbox size="md" label="Medium" />
    <UiCheckbox size="lg" label="Large" />
  </div>
</DemoFrame>

## Использование в форме

<DemoFrame title="name, value, native attrs">
  <UiCheckbox
    v-model="feature"
    name="features"
    value="documentation"
    label="Документация"
    data-testid="docs-feature"
  />
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `boolean` | `false` |
| `label`, `description` | `string` | — |
| `disabled`, `required`, `indeterminate` | `boolean` | `false` |
| `name` | `string` | — |
| `value` | `string \| number` | `'on'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

События: `update:modelValue`, `change`. Default slot заменяет label; native attrs передаются input.
