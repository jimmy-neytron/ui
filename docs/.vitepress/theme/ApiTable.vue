<script setup lang="ts">
import api from '../generated/api.json';
const props = defineProps<{ component: keyof typeof api }>();
const rows = api[props.component];
</script>

<template>
  <div class="api-table-wrap" tabindex="0" aria-label="Таблица параметров компонента">
    <table class="api-table">
      <thead><tr><th>Prop</th><th>Тип</th><th>Default</th><th>Обязательный</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.name"><td><code>{{ row.name }}</code></td><td><code>{{ row.type }}</code></td><td><code v-if="row.default !== '—'">{{ row.default }}</code><span v-else>—</span></td><td>{{ row.required ? 'Да' : 'Нет' }}</td></tr></tbody>
    </table>
  </div>
</template>