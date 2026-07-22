# Contribution Guide

## Требования

- Node.js 24+.
- npm.
- Чистое рабочее дерево перед изменением версии.

## Начало работы

```bash
npm ci
npm run dev
```

## Правила кода

- Vue 3 Composition API и `<script setup lang="ts">`.
- Strict TypeScript; запрещены `any`, `@ts-ignore`, prop mutation и browser side effects на уровне import.
- Сначала semantic HTML, затем только необходимая ARIA.
- Визуальные настройки добавляются через CSS variables, а не десятки props.
- Новый общий composable создаётся только при повторном использовании и стабильном контракте.
- Runtime dependencies добавляются только при документированной критической необходимости.

## Тесты

Тестируйте public behavior, а не внутреннюю реализацию. Snapshot не заменяет assertions по событиям, ARIA и keyboard behavior.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:size
npm run check:package
npm run test:package
```

Или одной командой:

```bash
npm run check
```

## Добавление компонента

Размещайте рядом:

```text
src/components/example/
  UiExample.vue
  UiExample.types.ts
  UiExample.test.ts
  index.ts
```

Добавьте public entry в `vite.config.ts`, `package.json#exports`, `src/index.ts`, package validation и consumer test.

## Pull request

Опишите public API, accessibility decisions, SSR impact, bundle impact и осознанные trade-offs. Не включайте generated `dist`, coverage, `.tgz` или secrets.
