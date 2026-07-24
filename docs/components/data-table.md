<script setup>
import { ref } from 'vue';
import { UiBadge, UiButton, UiDataTable, UiInput } from '@compact-ui';

const rows = [
  { id: 1, name: 'Анна Петрова', team: 'Design', status: 'active', age: 28, projects: 7 },
  { id: 2, name: 'Борис Волков', team: 'Frontend', status: 'active', age: 34, projects: 12 },
  { id: 3, name: 'Виктор Орлов', team: 'Backend', status: 'vacation', age: 23, projects: 4 },
  { id: 4, name: 'Галина Мирова', team: 'Frontend', status: 'active', age: 31, projects: 9 },
  { id: 5, name: 'Денис Левин', team: 'Design', status: 'inactive', age: 39, projects: 15 },
  { id: 6, name: 'Елена Соколова', team: 'Backend', status: 'active', age: 26, projects: 6 },
  { id: 7, name: 'Жанна Белова', team: 'QA', status: 'vacation', age: 30, projects: 8 },
];

const columns = [
  {
    key: 'name',
    label: 'Сотрудник',
    sortable: true,
    minWidth: 190,
    filter: { type: 'text', placeholder: 'Имя или фамилия' },
  },
  {
    key: 'team',
    label: 'Команда',
    sortable: true,
    filter: {
      type: 'select',
      searchable: true,
      options: [
        { label: 'Design', value: 'Design' },
        { label: 'Frontend', value: 'Frontend' },
        { label: 'Backend', value: 'Backend' },
        { label: 'QA', value: 'QA' },
      ],
    },
  },
  {
    key: 'status',
    label: 'Статус',
    filter: {
      type: 'select',
      options: [
        { label: 'Активен', value: 'active' },
        { label: 'В отпуске', value: 'vacation' },
        { label: 'Неактивен', value: 'inactive' },
      ],
    },
  },
  {
    key: 'age',
    label: 'Возраст',
    sortable: true,
    align: 'end',
    filter: { type: 'number-range', min: 18, max: 80 },
  },
  { key: 'projects', label: 'Проекты', sortable: true, align: 'end' },
];

const sort = ref({ key: 'name', direction: 'asc' });
const filters = ref({});
const page = ref(1);
const customFilters = ref({});
const search = ref('');
const lazyLoading = ref(false);

const lazySource = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `Пользователь ${index + 1}`,
  team: ['Design', 'Frontend', 'Backend', 'QA'][index % 4],
  age: 20 + (index % 25),
}));
const lazyRows = ref(lazySource.slice(0, 8));

const lazyColumns = [
  { key: 'id', label: 'ID', width: 72, align: 'end' },
  { key: 'name', label: 'Пользователь', sortable: true, minWidth: 190 },
  { key: 'team', label: 'Команда', minWidth: 140 },
  { key: 'age', label: 'Возраст', align: 'end' },
];

const stickyColumns = [
  { key: 'name', label: 'Сотрудник', sticky: 'start', width: 210, minWidth: 210 },
  { key: 'team', label: 'Команда', width: 150 },
  { key: 'status', label: 'Статус', width: 140 },
  { key: 'age', label: 'Возраст', align: 'end', width: 120 },
  { key: 'projects', label: 'Проекты', align: 'end', width: 120 },
  { key: 'email', label: 'Email', width: 240, truncate: true },
  { key: 'city', label: 'Город', width: 180 },
  { key: 'actions', label: '', sticky: 'end', width: 120, align: 'end' },
];

const stickyRows = rows.map((row) => ({
  ...row,
  email: `${row.name.toLocaleLowerCase().replace(' ', '.')}@example.com`,
  city: ['Москва', 'Казань', 'Тбилиси'][row.id % 3],
}));

function loadMore({ offset }) {
  if (lazyLoading.value) return;
  lazyLoading.value = true;
  window.setTimeout(() => {
    lazyRows.value.push(...lazySource.slice(offset, offset + 8));
    lazyLoading.value = false;
  }, 450);
}

const labels = {
  filters: 'Фильтры',
  filtersActive: 'активно',
  filterDialogTitle: 'Фильтры сотрудников',
  filterDialogDescription: 'Настройте условия и примените их к таблице.',
  applyFilters: 'Применить',
  resetFilters: 'Сбросить',
  empty: 'Сотрудники не найдены',
  loading: 'Загрузка сотрудников',
  results: 'результатов',
  sortAscending: 'Сортировать по возрастанию',
  sortDescending: 'Сортировать по убыванию',
  clearSorting: 'Убрать сортировку',
  clearSort: 'Убрать сортировку',
  minimum: 'От',
  maximum: 'До',
  loadingMore: 'Загружаем ещё',
  loadMore: 'Загрузить ещё',
};

const statusLabels = {
  active: 'Активен',
  vacation: 'В отпуске',
  inactive: 'Неактивен',
};

const statusTones = {
  active: 'success',
  vacation: 'warning',
  inactive: 'neutral',
};
</script>

# DataTable

Типизированная таблица с локальной или серверной обработкой данных. Сортировка
выполняется из заголовков, а фильтры открываются в отдельном доступном диалоге и
не занимают место над таблицей.

## Полный пример

<DemoFrame title="Сортировка, фильтры, pagination, sticky header и слоты">
  <UiDataTable
    v-model:sort="sort"
    v-model:filters="filters"
    v-model:page="page"
    :rows="rows"
    :columns="columns"
    :labels="labels"
    row-key="id"
    :page-size="4"
    :max-height="360"
    caption="Список сотрудников"
    aria-label="Сотрудники"
    striped
    hoverable
    sticky-header
  >
    <template #cell-name="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
    <template #cell-status="{ value }">
      <UiBadge :tone="statusTones[value]">
        {{ statusLabels[value] }}
      </UiBadge>
    </template>
    <template #toolbar="{ total }">
      <strong>Команда</strong>
      <span>{{ total }} сотрудников</span>
    </template>
  </UiDataTable>
</DemoFrame>

`sort`, `filters` и `page` — controlled state. Таблица отправляет обновления
через `v-model`, а родитель хранит состояние. При изменении сортировки или
фильтров страница автоматически сбрасывается на первую.

## Ленивая загрузка

`lazy` отключает обычную pagination и показывает уже загруженные строки. Когда
пользователь приближается к нижней границе, компонент отправляет `load-more` с
текущим `offset`, сортировкой и фильтрами.

<DemoFrame title="Infinite scroll с сохранением загруженных строк">
  <UiDataTable
    :rows="lazyRows"
    :columns="lazyColumns"
    row-key="id"
    lazy
    :has-more="lazyRows.length < lazySource.length"
    :loading-more="lazyLoading"
    :lazy-threshold="100"
    :max-height="300"
    :labels="labels"
    dense
    sticky-header
    @load-more="loadMore"
  />
</DemoFrame>

```vue
<UiDataTable
  :rows="items"
  :columns="columns"
  lazy
  :has-more="response.hasNextPage"
  :loading-more="loadingMore"
  :max-height="480"
  @load-more="({ offset, sort, filters }) =>
    fetchNextPage({ offset, sort, filters })"
/>
```

- `hasMore=false` останавливает автоматические запросы.
- `loadingMore` блокирует повторный запрос, но не скрывает текущие строки.
- `lazyThreshold` задаёт расстояние до нижней границы в пикселях.
- Кнопка внизу остаётся доступным fallback для клавиатуры и повторной загрузки.
- Слот `loading-more` полностью заменяет состояние догрузки.

## Закреплённые колонки

Укажите `sticky: 'start'` или `sticky: 'end'` в описании колонки. Таблица
учитывает LTR/RTL и использует logical CSS properties.

<DemoFrame title="Sticky header, первая и последняя колонки">
  <UiDataTable
    :rows="stickyRows"
    :columns="stickyColumns"
    row-key="id"
    :table-min-width="1100"
    :max-height="340"
    table-layout="fixed"
    sticky-header
    bordered
    hoverable
    :pagination="false"
  >
    <template #cell-status="{ value }">
      <UiBadge :tone="statusTones[value]">{{ statusLabels[value] }}</UiBadge>
    </template>
    <template #cell-actions="{ row }">
      <UiButton size="sm" variant="ghost" :aria-label="`Открыть ${row.name}`">
        Открыть
      </UiButton>
    </template>
  </UiDataTable>
</DemoFrame>

Если закреплено несколько колонок с одной стороны, задайте накопительный
`stickyOffset`:

```ts
[
  { key: 'select', label: '', sticky: 'start', width: 48 },
  {
    key: 'name',
    label: 'Название',
    sticky: 'start',
    stickyOffset: 48,
    width: 220,
  },
]
```

Для предсказуемой широкой таблицы используйте `tableMinWidth`, фиксированные
`width` колонок и при необходимости `tableLayout="fixed"`. `truncate: true`
добавляет ellipsis длинному содержимому.

## Плотность, границы и строки

<DemoFrame title="dense, bordered, striped, rowClass">
  <UiDataTable
    :rows="rows"
    :columns="columns"
    row-key="id"
    dense
    bordered
    striped
    :pagination="false"
    :row-class="(row) => row.status === 'inactive' ? 'is-muted-row' : undefined"
  />
</DemoFrame>

- `dense` уменьшает вертикальные и горизонтальные отступы.
- `bordered` добавляет вертикальные разделители.
- `striped` чередует фон строк.
- `hoverable` управляет hover-подсветкой.
- `rowClass` принимает строку или функцию `(row, index) => className`.

## Описание колонок

```ts
import type { UiDataTableColumn } from '@neytron/compact-ui';

interface User {
  id: number;
  profile: { name: string };
  balance: number;
}

const columns: UiDataTableColumn<User>[] = [
  {
    key: 'name',
    label: 'Пользователь',
    accessor: (row) => row.profile.name,
    sortable: true,
    minWidth: 220,
    filter: {
      type: 'text',
      placeholder: 'Начните вводить имя',
    },
  },
  {
    key: 'balance',
    label: 'Баланс',
    align: 'end',
    width: 140,
    sortable: true,
    format: (value) => `${value} ₽`,
    comparator: (left, right) => left.balance - right.balance,
    filter: {
      type: 'number-range',
      min: 0,
      step: 100,
    },
  },
];
```

`accessor` может быть ключом строки или функцией для вложенных и вычисляемых
значений. `comparator` переопределяет стандартное сравнение, `format` меняет
только отображение, а `headerClass` и `cellClass` позволяют точечно добавить
классы.

## Встроенные фильтры

| Тип | Значение | Назначение |
|---|---|---|
| `text` | `string` | Поиск подстроки, без учёта регистра по умолчанию |
| `select` | primitive или массив | Один или несколько вариантов, опциональный поиск |
| `number-range` | `{ min?, max? }` | Числовой диапазон |
| `custom` | любое | Пользовательский UI и `predicate` |

Фильтры одной таблицы объединяются через AND. Для любой колонки можно задать
свой `predicate`:

```ts
{
  key: 'tags',
  label: 'Теги',
  filter: {
    type: 'custom',
    predicate: (cellValue, filterValue) =>
      cellValue.some((tag) => filterValue.includes(tag)),
  },
}
```

Для `custom` используйте общий слот `filter` и выберите UI по ключу колонки:

```vue
<UiDataTable
  v-model:filters="customFilters"
  :rows="rows"
  :columns="columns"
>
  <template #filter="{ column, value, setValue }">
    <UiInput
      v-if="column.key === 'name'"
      :model-value="value ?? ''"
      label="Кастомный поиск"
      @update:model-value="setValue"
    />
  </template>
</UiDataTable>
```

При наличии слота `filter` он отвечает за отображение всех фильтров. Если нужна
полностью отдельная кнопка или собственный toolbar, можно напрямую использовать
`UiDataTableFilters`.

## Server-side режим

Каждый этап можно отключить независимо:

```vue
<UiDataTable
  v-model:sort="query.sort"
  v-model:filters="query.filters"
  v-model:page="query.page"
  :rows="response.items"
  :columns="columns"
  :total="response.total"
  :page-size="25"
  :loading="pending"
  manual-sorting
  manual-filtering
  manual-pagination
  @sort-change="load"
  @filters-change="load"
  @page-change="load"
/>
```

- `manualSorting` отключает локальную сортировку.
- `manualFiltering` отключает локальные predicates.
- `manualPagination` считает, что `rows` уже содержат нужную страницу.
- `total` задаёт полное число строк для pagination.
- Для cursor/offset API вместо `manualPagination` можно использовать `lazy`.

Флаги можно комбинировать: например, оставить локальную сортировку, но загружать
фильтры и страницы с API.

## Слоты

| Слот | Данные |
|---|---|
| `toolbar` | `rows`, `total`, `filters`, `sort` |
| `header-{key}` | `column`, `sort`, `toggleSort` |
| `cell-{key}` | `row`, `column`, `value`, `rowIndex` |
| `filter` | `column`, `value`, `setValue`, `filters` |
| `loading` | — |
| `loading-more` | `loading`, `loadMore` |
| `empty` | `filters` |
| `footer` | `rows`, `total`, `page` |

## События

- `update:sort`, `sort-change`
- `update:filters`, `filters-change`
- `update:page`, `page-change`
- `row-click`
- `row-dblclick`

`update:*` предназначены для `v-model`, а `*-change` удобны для загрузки данных
с сервера.

## Props

<ApiTable component="UiDataTableProps" />

## Настройка внешнего вида

```css
.users-table {
  --cui-data-table-radius: 16px;
  --cui-data-table-background: #ffffff;
  --cui-data-table-header-background: #f8fafc;
  --cui-data-table-row-hover-background: #f1f5f9;
  --cui-data-table-row-striped-background: #fafafa;
  --cui-data-table-border-color: #e2e8f0;
  --cui-data-table-sort-color: #7c3aed;
  --cui-data-table-sticky-background: #ffffff;
  --cui-data-table-sticky-shadow-color: rgb(15 23 42 / 22%);
  --cui-data-table-cell-padding-block: 0.75rem;
  --cui-data-table-cell-padding-inline: 1rem;
  --cui-data-table-row-min-height: 3rem;
}
```

Токены можно задать глобально, отдельно внутри light/dark темы или только на
конкретной таблице.

## Доступность

Компонент использует нативные `table`, `thead`, `th`, `tbody` и `caption`.
Сортируемые заголовки являются кнопками и обновляют `aria-sort`. Диалог фильтров
удерживает фокус, закрывается по Escape и возвращает фокус на кнопку. Состояние
загрузки передаётся через `aria-busy`, а горизонтальная прокрутка остаётся
доступной с клавиатуры и touch-устройств.
