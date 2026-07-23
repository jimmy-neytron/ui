<script setup>
import { ref } from 'vue';
import { UiSwitch } from '@compact-ui';

const notifications = ref(true);
const analytics = ref(false);
</script>

# Switch

Переключатель немедленной настройки на основе native checkbox.

## Значение и описание

<DemoFrame title="modelValue, label, description">
  <div class="demo-stack">
    <UiSwitch v-model="notifications" label="Уведомления" description="Получать обновления продукта" />
    <UiSwitch v-model="analytics">Label через default slot</UiSwitch>
  </div>
</DemoFrame>

## Состояния и форма

<DemoFrame title="disabled, required, name, native attrs">
  <div class="demo-stack">
    <UiSwitch label="Disabled off" disabled />
    <UiSwitch model-value label="Disabled on" disabled />
    <UiSwitch
      v-model="analytics"
      label="Обязательная настройка"
      name="analytics"
      required
      aria-label="Analytics"
    />
  </div>
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-stack">
    <UiSwitch size="sm" label="Small" />
    <UiSwitch size="md" label="Medium" />
    <UiSwitch size="lg" label="Large" />
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `boolean` | `false` |
| `label`, `description` | `string` | — |
| `disabled`, `required` | `boolean` | `false` |
| `name` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

События: `update:modelValue`, `change`. Default slot заменяет label; native attrs передаются input.
