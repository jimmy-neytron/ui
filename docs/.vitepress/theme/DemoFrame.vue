<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: 'Пример',
  description: '',
});
</script>
<template>
  <section class="demo-frame">
    <header v-if="title || description" class="demo-frame__header">
      <strong>{{ title }}</strong><span v-if="description">{{ description }}</span>
    </header>
    <div class="demo-frame__content"><slot /></div>
  </section>
</template>
