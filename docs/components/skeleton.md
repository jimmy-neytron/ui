<script setup>
import { UiSkeleton } from '@compact-ui';
</script>
# Skeleton
Заполнитель контента с поддержкой reduced motion.
## Все параметры
<DemoFrame title="variant, width, height, lines, animated, label">
  <div class="demo-stack"><UiSkeleton variant="circle" :width="48" :height="48" label="Загружается аватар" /><UiSkeleton variant="text" width="80%" :lines="3" /><UiSkeleton variant="rect" height="72px" :animated="false" /></div>
</DemoFrame>
## Props
<ApiTable component="UiSkeletonProps" />
Без `label` компонент декоративный; с `label` получает `role="status"`.