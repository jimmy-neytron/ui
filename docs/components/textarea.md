<script setup>
import { ref } from 'vue';
import { UiTextarea } from '@compact-ui';

const description = ref('Короткое описание продукта.');
const limited = ref('Счётчик символов');
const auto = ref('Добавляйте строки — высота изменится автоматически.');
</script>

# Textarea

Многострочное controlled-поле с ограничениями, счётчиком и auto-resize.

## Базовый пример

<DemoFrame title="modelValue, label, placeholder, hint, rows, name">
  <UiTextarea
    v-model="description"
    label="Описание"
    placeholder="Расскажите о продукте"
    hint="Достаточно 2–3 предложений"
    :rows="3"
    name="description"
  />
</DemoFrame>

## Ограничение и счётчик

<DemoFrame title="maxlength, showCount">
  <UiTextarea
    v-model="limited"
    label="Краткое описание"
    :maxlength="40"
    show-count
  />
</DemoFrame>

## Resize и autoResize

<DemoFrame title="resize, autoResize">
  <div class="demo-stack">
    <UiTextarea label="Без resize" resize="none" model-value="Фиксированный размер" />
    <UiTextarea label="Horizontal" resize="horizontal" model-value="Можно менять ширину" />
    <UiTextarea label="Both" resize="both" model-value="Можно менять оба размера" />
    <UiTextarea v-model="auto" label="Auto resize" auto-resize />
  </div>
</DemoFrame>

## Состояния

<DemoFrame title="error, disabled, readonly, required">
  <div class="demo-stack">
    <UiTextarea label="Ошибка" error="Описание слишком короткое" model-value="Нет" />
    <UiTextarea label="Disabled" disabled model-value="Недоступно" />
    <UiTextarea label="Readonly" readonly model-value="Только чтение" />
    <UiTextarea label="Required" required placeholder="Обязательное поле" />
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| `modelValue` | `string` | `''` |
| `label`, `placeholder`, `hint`, `error` | `string` | — |
| `rows` | `number` | `4` |
| `maxlength` | `number` | — |
| `showCount` | `boolean` | `false` |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `autoResize` | `boolean` | `false` |
| `disabled`, `readonly`, `required` | `boolean` | `false` |
| `name` | `string` | — |

События: `update:modelValue`, `focus`, `blur`, `change`.
