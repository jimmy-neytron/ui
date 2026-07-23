<script setup>
import { UiProgress } from '@compact-ui';
const bytes = (value, min, max) => (value - min) + ' из ' + (max - min) + ' МБ';
</script>

# Progress

Индикатор выполнения для определённого и неопределённого прогресса. Значение автоматически ограничивается диапазоном min–max.

## Значения

<DemoFrame title="value, min, max, showValue">
  <div class="demo-stack">
    <UiProgress label="Загрузка" :value="38" show-value />
    <UiProgress label="Обработка" :value="15" :min="10" :max="30" show-value />
    <UiProgress label="Подготовка" />
  </div>
</DemoFrame>

## Tones

<DemoFrame title="tone">
  <div class="demo-stack">
    <UiProgress tone="primary" :value="65" />
    <UiProgress tone="success" :value="65" />
    <UiProgress tone="warning" :value="65" />
    <UiProgress tone="danger" :value="65" />
  </div>
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-stack">
    <UiProgress size="sm" :value="55" />
    <UiProgress size="md" :value="55" />
    <UiProgress size="lg" :value="55" />
  </div>
</DemoFrame>

## Форматирование и label slot

<DemoFrame title="formatValue, label, native attrs">
  <UiProgress :value="32" :max="64" :format-value="bytes" show-value data-testid="download">
    <template #label>Скачивание пакета</template>
  </UiProgress>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| value | number или null | null |
| min | number | 0 |
| max | number | 100 |
| label | string | — |
| showValue | boolean | false |
| formatValue | (value, min, max) => string | процент |
| size | sm, md, lg | md |
| tone | primary, success, warning, danger | primary |

Slot: label. При value=null компонент переходит в indeterminate-состояние. Native attrs передаются корневому элементу.
