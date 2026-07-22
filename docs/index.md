---
layout: home
hero:
  name: Compact UI
  text: Компоненты без лишнего слоя
  tagline: Лёгкая типизированная UI-библиотека для Vue 3. Предсказуемый API, темы через CSS-токены и доступность из коробки.
  actions:
    - theme: brand
      text: Начать работу
      link: /guide/getting-started
    - theme: alt
      text: Компоненты
      link: /components/button
features:
  - title: Четыре основных компонента
    details: Button, Input, Textarea и Select покрывают базовые формы без runtime-зависимостей.
  - title: Строгая типизация
    details: Props, события, значения и опции доступны как публичные TypeScript-типы.
  - title: Настраиваемая тема
    details: Светлая, тёмная и системная темы плюс CSS Custom Properties.
---
<DemoFrame title="Живые компоненты" description="Примеры используют текущий исходный код библиотеки."><ComponentGallery /></DemoFrame>

## Быстрый старт
```bash
npm install @neytron/compact-ui
```
```ts
import { UiButton } from '@neytron/compact-ui';
import '@neytron/compact-ui/styles.css';
```
