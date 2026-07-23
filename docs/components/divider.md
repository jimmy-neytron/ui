<script setup>
import { UiDivider } from '@compact-ui';
</script>
# Divider
Семантический разделитель для горизонтальных и вертикальных компоновок.
## Ориентация и подпись
<DemoFrame title="orientation, labelPosition, default slot">
  <div><UiDivider label-position="start">Начало</UiDivider><UiDivider label-position="center">Центр</UiDivider><UiDivider label-position="end">Конец</UiDivider><div class="demo-inline" style="height:48px">Слева<UiDivider orientation="vertical" />Справа</div></div>
</DemoFrame>
## Props
<ApiTable component="UiDividerProps" />
Слот: `default` — подпись горизонтального разделителя.