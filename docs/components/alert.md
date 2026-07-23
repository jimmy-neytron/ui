<script setup>
import { ref } from 'vue';
import { UiAlert, UiButton } from '@compact-ui';
const visible = ref(true);
</script>

# Alert

Сообщение о результате операции или важном состоянии. Для обычных обновлений используется role=status, для срочных — role=alert.

## Tones

<DemoFrame title="tone">
  <div class="demo-stack">
    <UiAlert tone="info">Доступно новое обновление.</UiAlert>
    <UiAlert tone="success">Изменения сохранены.</UiAlert>
    <UiAlert tone="warning">Срок действия ссылки скоро закончится.</UiAlert>
    <UiAlert tone="danger" role="alert">Не удалось сохранить изменения.</UiAlert>
  </div>
</DemoFrame>

## Variants

<DemoFrame title="variant">
  <div class="demo-stack">
    <UiAlert variant="soft">Soft</UiAlert>
    <UiAlert variant="outline">Outline</UiAlert>
  </div>
</DemoFrame>

## Title и slots

<DemoFrame title="title, icon, actions">
  <UiAlert title="Черновик сохранён" tone="success">
    Документ можно продолжить редактировать позже.
    <template #icon>✓</template>
    <template #actions><UiButton size="sm" variant="ghost">Открыть</UiButton></template>
  </UiAlert>
</DemoFrame>

## Закрытие

<DemoFrame title="dismissible, dismissLabel, dismiss">
  <div class="demo-stack">
    <UiAlert v-if="visible" dismissible dismiss-label="Закрыть уведомление" @dismiss="visible = false">
      Это сообщение можно закрыть.
    </UiAlert>
    <UiButton v-else size="sm" variant="secondary" @click="visible = true">Показать снова</UiButton>
    <UiAlert dismissible>
      Своя иконка закрытия.
      <template #close>Закрыть</template>
    </UiAlert>
  </div>
</DemoFrame>

## Props

| Prop | Тип | Default |
|---|---|---|
| tone | info, success, warning, danger | info |
| variant | soft, outline | soft |
| title | string | — |
| dismissible | boolean | false |
| dismissLabel | string | Dismiss alert |
| role | status, alert | status |

Событие: dismiss(event: MouseEvent). Slots: default, title, icon, actions, close. Native attrs передаются корневому div.
