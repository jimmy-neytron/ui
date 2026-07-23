<script setup lang="ts">
import { ref } from 'vue';
import { UiAlert, UiButton, UiCard, UiTextarea, type UiSelectOption, type UiSelectValue } from '@neytron/compact-ui';
import { UiInput } from '@neytron/compact-ui/input';
import { UiSelect } from '@neytron/compact-ui/select';
import { UiProgress } from '@neytron/compact-ui/progress';
import { UiSpinner } from '@neytron/compact-ui/spinner';

const name = ref('Consumer app');
const notes = ref('Installed from the generated npm tarball.');
const value = ref<UiSelectValue | null>('typed');
const options: UiSelectOption[] = [
  { label: 'Root export types work', value: 'typed' },
  { label: 'Direct exports work', value: 'direct' },
];
</script>

<template>
  <main class="consumer" data-cui-theme="system">
    <h1>Compact UI consumer</h1>
    <UiAlert tone="success">Packed exports work.</UiAlert>
    <UiCard variant="filled">Consumer card</UiCard>
    <UiProgress :value="100" label="Package validation" />
    <UiSpinner decorative />
    <UiInput v-model="name" label="Name" clearable />
    <UiTextarea v-model="notes" label="Notes" show-count :maxlength="120" />
    <UiSelect v-model="value" label="Package check" :options="options" searchable clearable />
    <UiButton @click="notes = `Saved: ${name}`">Save</UiButton>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: var(--cui-color-text);
  background: var(--cui-color-background);
}

.consumer {
  display: grid;
  gap: 1rem;
  max-inline-size: 32rem;
  min-block-size: 100vh;
  align-content: center;
  margin-inline: auto;
  padding: 2rem;
}
</style>
