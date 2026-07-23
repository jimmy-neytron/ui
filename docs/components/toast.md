<script setup>
import { UiToast } from '@compact-ui';
</script>

# Toast

Уведомления с очередью, автоматическим закрытием и паузой таймера при наведении.

## Интерактивный пример

Нажмите кнопку — уведомление появится в правом верхнем углу страницы.

<DemoFrame title="UiToastProvider, useToast, push, clear">
  <ToastPlayground />
</DemoFrame>

## Использование в приложении

Оберните приложение в `UiToastProvider`. `useToast` вызывается в любом дочернем компоненте.

```vue
<script setup lang="ts">
import { UiToastProvider, useToast } from '@neytron/compact-ui'

const toast = useToast()

function save() {
  toast.push({
    title: 'Сохранено',
    description: 'Изменения успешно применены',
    tone: 'success',
    duration: 5000,
  })
}
</script>
```

`push()` возвращает id уведомления. Также доступны `remove(id)` и `clear()`.

## Отдельный Toast

<DemoFrame title="modelValue, title, description, tone, duration, dismissible, closeLabel">
  <UiToast
    title="Локальное уведомление"
    description="Можно использовать без очереди."
    tone="success"
    :duration="0"
  />
</DemoFrame>

## Props

<ApiTable component="UiToastProps" />

События: `update:modelValue`, `close`. Слот: `default`.