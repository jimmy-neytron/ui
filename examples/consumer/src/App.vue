<script setup lang="ts">
import { ref } from 'vue';
import { UiAlert, UiButton, UiCard, UiDialog, UiTabs, UiTextarea, type UiSelectOption, type UiSelectValue } from '@neytron/compact-ui';
import { UiAvatar } from '@neytron/compact-ui/avatar';
import { UiInput } from '@neytron/compact-ui/input';
import { UiProgress } from '@neytron/compact-ui/progress';
import { UiSelect } from '@neytron/compact-ui/select';
import { UiSpinner } from '@neytron/compact-ui/spinner';
import { UiToast } from '@neytron/compact-ui/toast';

const name = ref('Consumer app');
const notes = ref('Installed from the generated npm tarball.');
const value = ref<UiSelectValue | null>('typed');
const dialogOpen = ref(false);
const activeTab = ref('package');
const tabs = [{ value: 'package', label: 'Package', panel: 'Root export works' }, { value: 'direct', label: 'Direct', panel: 'Subpath export works' }];
const options: UiSelectOption[] = [{ label: 'Root export types work', value: 'typed' }, { label: 'Direct exports work', value: 'direct' }];
</script>

<template>
  <main class="consumer" data-cui-theme="system">
    <h1>Compact UI consumer</h1>
    <UiAlert tone="success">Packed exports work.</UiAlert>
    <UiCard variant="filled">Consumer card</UiCard>
    <UiProgress :value="100" label="Package validation" />
    <div><UiAvatar name="Consumer App" status="online" /> <UiSpinner decorative /></div>
    <UiTabs v-model="activeTab" :items="tabs" />
    <UiToast title="Installed" description="Toast direct export works" :duration="0" />
    <UiInput v-model="name" label="Name" clearable />
    <UiTextarea v-model="notes" label="Notes" show-count :maxlength="120" />
    <UiSelect v-model="value" label="Package check" :options="options" searchable clearable />
    <UiButton @click="dialogOpen = true">Open dialog</UiButton>
    <UiDialog v-model="dialogOpen" title="Packed dialog"><UiButton @click="dialogOpen = false">Close</UiButton></UiDialog>
  </main>
</template>

<style>
body { margin: 0; font-family: system-ui, sans-serif; color: var(--cui-color-text); background: var(--cui-color-background); }
.consumer { display: grid; gap: 1rem; max-inline-size: 32rem; min-block-size: 100vh; align-content: center; margin-inline: auto; padding: 2rem; }
</style>