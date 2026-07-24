# Обзор

Compact UI — ESM-first библиотека из 26 Vue 3 компонентов с TypeScript API, доступными состояниями и темами без отдельного runtime.

## Ввод и действия

| Компонент | Назначение |
|---|---|
| [`UiButton`](/components/button) | Действия и loading |
| [`UiInput`](/components/input) | Строковые и числовые поля |
| [`UiDataTable`](/components/data-table) | Таблицы с сортировкой, фильтрами и пагинацией |
| [`UiTextarea`](/components/textarea) | Многострочный ввод |
| [`UiSelect`](/components/select) | Одиночный/множественный выбор и поиск |
| [`UiCheckbox`](/components/checkbox) | Boolean и indeterminate |
| [`UiRadio`](/components/radio) | Radio-группы |
| [`UiSwitch`](/components/switch) | Переключение настроек |

## Навигация и disclosure

| Компонент | Назначение |
|---|---|
| [`UiAccordion`](/components/accordion) | Раскрывающиеся разделы |
| [`UiBreadcrumb`](/components/breadcrumb) | Навигационная цепочка |
| [`UiPagination`](/components/pagination) | Постраничная навигация |
| [`UiTabs`](/components/tabs) | Переключаемые панели |
| [`UiDropdownMenu`](/components/dropdown-menu) | Меню действий |

## Feedback и представление

| Компонент | Назначение |
|---|---|
| [`UiBadge`](/components/badge) | Метки и статусы |
| [`UiAlert`](/components/alert) | Сообщения в потоке страницы |
| [`UiToast`](/components/toast) | Очередь уведомлений |
| [`UiProgress`](/components/progress) | Progress indicator |
| [`UiSpinner`](/components/spinner) | Компактное ожидание |
| [`UiSkeleton`](/components/skeleton) | Placeholder контента |
| [`UiEmptyState`](/components/empty-state) | Пустые состояния |
| [`UiAvatar`](/components/avatar) | Изображение и инициалы пользователя |

## Layout и overlay

| Компонент | Назначение |
|---|---|
| [`UiCard`](/components/card) | Семантический контейнер |
| [`UiDivider`](/components/divider) | Разделитель контента |
| [`UiDialog`](/components/dialog) | Модальный сценарий |
| [`UiPopover`](/components/popover) | Интерактивная панель |
| [`UiTooltip`](/components/tooltip) | Короткая подсказка |

## Технические свойства

- Vue `>=3.5.0 <4`, Node.js `>=24` для разработки.
- ESM-only, Vue остаётся peer dependency.
- Root/direct imports и отдельный CSS entry.
- SSR guards, logical CSS properties для RTL, reduced motion и keyboard-first поведение.
- Локализация через `UiConfigProvider`; уведомления через `UiToastProvider`.
- Props-таблицы документации генерируются из TypeScript source of truth.

## Границы

В библиотеке нет набора иконок, шрифтов, remote search, virtualization и validation engine. Данные, бизнес-правила и ошибки остаются в приложении.
