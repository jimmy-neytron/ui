<script setup>
import { UiButton } from '@compact-ui';
</script>

# Button

Кнопка для действий, форм и асинхронных состояний.

## Варианты

<DemoFrame title="variant">
  <div class="demo-row demo-row--center">
    <UiButton variant="primary">Primary</UiButton>
    <UiButton variant="secondary">Secondary</UiButton>
    <UiButton variant="ghost">Ghost</UiButton>
    <UiButton variant="danger">Danger</UiButton>
  </div>
</DemoFrame>

## Размеры

<DemoFrame title="size">
  <div class="demo-row demo-row--center">
    <UiButton size="sm">Small</UiButton>
    <UiButton size="md">Medium</UiButton>
    <UiButton size="lg">Large</UiButton>
  </div>
</DemoFrame>

## Состояния и ширина

<DemoFrame title="disabled, loading, block">
  <div class="demo-stack">
    <div class="demo-row">
      <UiButton disabled>Disabled</UiButton>
      <UiButton loading>Loading</UiButton>
    </div>
    <div class="demo-block">
      <UiButton block>Block button</UiButton>
    </div>
  </div>
</DemoFrame>

## Type, aria-label и слоты

<DemoFrame title="type, ariaLabel, leading, trailing, loader">
  <div class="demo-row demo-row--center">
    <UiButton type="submit">Submit</UiButton>
    <UiButton type="reset" variant="secondary">Reset</UiButton>
    <UiButton aria-label="Добавить элемент">＋</UiButton>
    <UiButton>
      <template #leading>←</template>
      Назад
    </UiButton>
    <UiButton>
      Далее
      <template #trailing>→</template>
    </UiButton>
    <UiButton loading>
      Загрузка
      <template #loader>•••</template>
    </UiButton>
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default | Описание |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Внешний вид |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер |
| `type` | native button type | `'button'` | `button`, `submit`, `reset` |
| `disabled` | `boolean` | `false` | Отключает кнопку |
| `loading` | `boolean` | `false` | Loader, блокировка click, `aria-busy` |
| `block` | `boolean` | `false` | Ширина контейнера |
| `ariaLabel` | `string` | — | Доступное имя |

Native attrs передаются `button`. Событие: `click(MouseEvent)`. Слоты: `default`, `leading`, `trailing`, `loader`.
