<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';

const { isDark } = useData();
let stopThemeSync: WatchStopHandle | undefined;

onMounted(() => {
  stopThemeSync = watch(
    isDark,
    (dark) => {
      document.documentElement.dataset.cuiTheme = dark ? 'dark' : 'light';
    },
    { immediate: true },
  );
});

onBeforeUnmount(() => {
  stopThemeSync?.();
  document.documentElement.removeAttribute('data-cui-theme');
});
</script>

<template>
  <DefaultTheme.Layout />
</template>
