<script setup>
import { UiButton } from '@compact-ui';
</script>

# Button

Кнопка действий с вариантами, размерами и loading-состоянием.

<DemoFrame title="Варианты">
  <UiButton>Primary</UiButton><UiButton variant="secondary">Secondary</UiButton>
  <UiButton variant="ghost">Ghost</UiButton><UiButton variant="danger">Danger</UiButton>
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

Остальные attrs передаются native `button`.

## События

| Событие | Payload | Описание |
|---|---|---|
| `click` | `MouseEvent` | Не вызывается при `disabled` или `loading` |

## Слоты

| Слот | Назначение |
|---|---|
| `default` | Основное содержимое |
| `leading` / `trailing` | Контент до/после текста |
| `loader` | Замена spinner |

```vue
<UiButton :loading="saving" @click="save">
  <template #leading>＋</template>
  Создать
</UiButton>
```
