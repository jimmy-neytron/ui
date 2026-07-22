# Установка

## Требования

Vue `>=3.5.0 <4` и современный ESM-bundler.

```bash
npm install @neytron/compact-ui vue
```

## Подключение

Импортируйте CSS один раз в entry-файле:

```ts
import { createApp } from 'vue';
import App from './App.vue';
import '@neytron/compact-ui/styles.css';
createApp(App).mount('#app');
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiInput } from '@neytron/compact-ui';
const name = ref('');
</script>
<template>
  <form @submit.prevent>
    <UiInput v-model="name" label="Имя" required />
    <UiButton type="submit">Продолжить</UiButton>
  </form>
</template>
```

## Direct imports

```ts
import { UiButton } from '@neytron/compact-ui/button';
import { UiInput } from '@neytron/compact-ui/input';
```

## Nuxt 3

```ts
export default defineNuxtConfig({
  css: ['@neytron/compact-ui/styles.css'],
});
```

Отдельный Nuxt plugin не нужен.
