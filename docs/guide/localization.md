# Локализация

Системные подписи компонентов находятся в одном типизированном объекте. Оберните нужную часть приложения в `UiConfigProvider`; непереданные ключи сохранят английские значения по умолчанию.

```vue
<script setup lang="ts">
import { UiConfigProvider } from '@neytron/compact-ui'

const ru = {
  close: 'Закрыть',
  dismiss: 'Скрыть',
  clearInput: 'Очистить поле',
  clearSelection: 'Очистить выбор',
  loading: 'Загрузка',
  searchOptions: 'Поиск вариантов',
  selectOption: 'Выберите вариант',
  noOptions: 'Нет вариантов',
  noResults: 'Ничего не найдено',
  removeOption: 'Удалить',
  previousPage: 'Предыдущая страница',
  nextPage: 'Следующая страница',
  openMenu: 'Открыть меню',
}
</script>

<template>
  <UiConfigProvider :locale="ru">
    <App />
  </UiConfigProvider>
</template>
```

Локальные props вроде `closeLabel`, `searchPlaceholder` и `ariaLabel` имеют приоритет над provider. Тип объекта — `Partial<UiLocaleMessages>`.

Для уведомлений добавьте `UiToastProvider` внутри конфигурационного provider:

```vue
<UiConfigProvider :locale="ru">
  <UiToastProvider><App /></UiToastProvider>
</UiConfigProvider>
```