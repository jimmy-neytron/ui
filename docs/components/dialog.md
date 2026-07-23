<script setup>
import { ref } from 'vue';
import { UiButton, UiDialog, UiSelect } from '@compact-ui';

const opened = ref(false);
const animation = ref('scale');
const animationOptions = [
  { label: 'Масштабирование', value: 'scale' },
  { label: 'Плавное появление', value: 'fade' },
  { label: 'Снизу вверх', value: 'slide-up' },
  { label: 'Без анимации', value: 'none' },
];
</script>

# Dialog

Модальное окно с заметными анимациями открытия и закрытия, focus trap и восстановлением фокуса.

## Базовый диалог

<DemoFrame title="modelValue, title, description, size, animation, closeLabel">
  <div class="demo-stack">
    <UiSelect
      v-model="animation"
      :options="animationOptions"
      label="Анимация"
      :clearable="false"
    />
    <UiButton @click="opened = true">Открыть диалог</UiButton>
  </div>

  <UiDialog
    v-model="opened"
    title="Подтвердите действие"
    description="Проверьте данные перед сохранением."
    size="md"
    :animation="animation"
    force-motion
    close-label="Закрыть окно"
  >
    <p>Содержимое диалога имеет одинаковые внутренние отступы со всех сторон.</p>
    <template #footer>
      <UiButton variant="secondary" @click="opened = false">Отмена</UiButton>
      <UiButton @click="opened = false">Сохранить</UiButton>
    </template>
  </UiDialog>
</DemoFrame>

В примере включён orceMotion, поэтому эффект виден даже при системном prefers-reduced-motion. В приложении используйте его только когда это действительно нужно.

## Своя анимация

Передайте `transitionName`, чтобы использовать стандартные CSS-классы Vue Transition.

```vue
<UiDialog v-model="opened" transition-name="product-dialog">
  Содержимое
</UiDialog>

<style>
.product-dialog-enter-active,
.product-dialog-leave-active {
  transition: opacity 240ms ease;
}

.product-dialog-enter-from,
.product-dialog-leave-to {
  opacity: 0;
}

.product-dialog-enter-active .cui-dialog,
.product-dialog-leave-active .cui-dialog {
  transition: transform 240ms ease;
}

.product-dialog-enter-from .cui-dialog,
.product-dialog-leave-to .cui-dialog {
  transform: translateY(24px);
}
</style>
```

## Props

<ApiTable component="UiDialogProps" />

События: `update:modelValue`, `close(reason)`.

Слоты: `title`, `default`, `footer`.