<script setup>
import { UiButton, UiEmptyState } from '@compact-ui';
</script>
# EmptyState
Пустое состояние с понятным следующим действием.
## Размеры и слоты
<DemoFrame title="title, description, size, icon, actions, default">
  <div class="demo-stack"><UiEmptyState title="Ничего не найдено" description="Измените фильтры" size="sm"><template #icon>⌕</template><template #actions><UiButton>Сбросить</UiButton></template></UiEmptyState><UiEmptyState size="lg"><template #title>Своя заголовочная разметка</template><template #default>Описание через default slot</template></UiEmptyState></div>
</DemoFrame>
## Props
<ApiTable component="UiEmptyStateProps" />
Слоты: `icon`, `title`, `default`, `actions`.