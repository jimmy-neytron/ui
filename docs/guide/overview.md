# Обзор

Compact UI — ESM-first библиотека компонентов для Vue 3 с TypeScript-типами и темами без отдельного runtime.

## Что входит

| Компонент | Назначение |
|---|---|
| [`UiButton`](/components/button) | Действия и loading-состояния |
| [`UiInput`](/components/input) | Строковые и числовые поля |
| [`UiTextarea`](/components/textarea) | Многострочный ввод и auto-resize |
| [`UiSelect`](/components/select) | Одиночный/множественный выбор и поиск |
| [`UiCheckbox`](/components/checkbox) | Boolean-выбор и indeterminate-состояние |
| [`UiRadio`](/components/radio) | Типизированные radio-группы |
| [`UiSwitch`](/components/switch) | Переключение настроек |
| [`UiBadge`](/components/badge) | Статусы и компактные метки |

## Технические свойства

- Vue `>=3.5.0 <4`, Node.js `>=24` для разработки.
- ESM-only; Vue указана как peer dependency.
- Root и direct imports, отдельный CSS entry.
- SSR-safe и keyboard-first.

## Границы

В библиотеке нет общего набора иконок, шрифтов, remote search, virtualization и validation engine. Данные и ошибки приходят из приложения.
