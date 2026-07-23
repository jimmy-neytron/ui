<script setup>
import { ref } from 'vue'; import { UiButton, UiDropdownMenu } from '@compact-ui';
const open = ref(false); const items = [{ value:'edit', label:'Редактировать' },{ value:'docs', label:'Документация', href:'/guide/overview' },{ value:'archive', label:'Архивировать', disabled:true },{ value:'delete', label:'Удалить', danger:true }];
</script>
# DropdownMenu
Меню действий с навигацией стрелками, `Home`, `End` и `Escape`.
## Все типы пунктов
<DemoFrame title="modelValue, items, placement, disabled, trigger, item">
  <div class="demo-inline"><UiDropdownMenu v-model="open" :items="items" placement="bottom" @select="value => console.log(value)"><template #trigger><UiButton>Действия</UiButton></template><template #item="{ item }">{{ item.danger ? '⚠ ' : '' }}{{ item.label }}</template></UiDropdownMenu><UiDropdownMenu :items="items" disabled><template #trigger><UiButton disabled>Недоступно</UiButton></template></UiDropdownMenu></div>
</DemoFrame>
## Props
<ApiTable component="UiDropdownMenuProps" />
`items`: `value`, `label`, необязательные `href`, `disabled`, `danger`. События: `update:modelValue`, `select`, `open`, `close`.