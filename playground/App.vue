<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  UiButton,
  UiInput,
  UiSelect,
  UiTextarea,
  type UiSelectOption,
  type UiSelectValue,
} from '@compact-ui/index';

const theme = ref<'light' | 'dark' | 'system'>('system');
const primaryColor = ref('#3578e5');
const radius = ref(9);

const inputValue = ref('Compact UI');
const numericValue = ref<number | string>(12);
const notes = ref('Компоненты наследуют шрифт приложения и настраиваются CSS-переменными.');
const autoNotes = ref('Добавьте несколько строк, чтобы проверить auto-resize.');
const singleValue = ref<UiSelectValue | null>('design');
const multipleValue = ref<UiSelectValue[]>(['vue', 'typescript']);
const searchValue = ref<UiSelectValue | null>(null);
const searchableMultiple = ref<UiSelectValue[]>([]);

const options: UiSelectOption[] = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Design systems', value: 'design' },
  { label: 'Accessibility', value: 'a11y' },
  { label: 'Disabled option', value: 'disabled', disabled: true },
];

const themeStyle = computed(() => ({
  '--cui-color-primary': primaryColor.value,
  '--cui-color-primary-hover': `color-mix(in srgb, ${primaryColor.value} 84%, black)`,
  '--cui-radius-sm': `${Math.max(2, radius.value - 3)}px`,
  '--cui-radius-md': `${radius.value}px`,
  '--cui-radius-lg': `${radius.value + 4}px`,
}));
</script>

<template>
  <div
    class="playground"
    :data-cui-theme="theme"
    :style="themeStyle"
  >
    <aside class="playground__panel">
      <div>
        <p class="eyebrow">Compact UI · 0.1.0</p>
        <h1>Playground</h1>
        <p class="muted">Локальная проверка цветов, скруглений и поведения компонентов. Размеры задаются шрифтами и padding-токенами приложения.</p>
      </div>

      <label class="playground__setting">
        <span>Theme</span>
        <select v-model="theme">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label class="playground__setting">
        <span>Primary color</span>
        <input v-model="primaryColor" type="color" />
      </label>

      <label class="playground__setting">
        <span>Radius: {{ radius }}px</span>
        <input v-model.number="radius" type="range" min="2" max="24" />
      </label>

    </aside>

    <main class="playground__content">
      <section class="demo-section">
        <header>
          <p class="eyebrow">Actions</p>
          <h2>UiButton</h2>
        </header>

        <div class="demo-grid">
          <div class="demo-card">
            <h3>Variants</h3>
            <div class="demo-row">
              <UiButton variant="primary">Primary</UiButton>
              <UiButton variant="secondary">Secondary</UiButton>
              <UiButton variant="ghost">Ghost</UiButton>
              <UiButton variant="danger">Danger</UiButton>
            </div>
          </div>

          <div class="demo-card">
            <h3>Sizes and states</h3>
            <div class="demo-row">
              <UiButton size="sm">Small</UiButton>
              <UiButton size="md">Medium</UiButton>
              <UiButton size="lg">Large</UiButton>
              <UiButton loading>Saving</UiButton>
              <UiButton disabled>Disabled</UiButton>
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <header>
          <p class="eyebrow">Text controls</p>
          <h2>UiInput</h2>
        </header>

        <div class="demo-grid">
          <div class="demo-card">
            <UiInput v-model="inputValue" label="Project name" hint="Visible to your team" clearable />
            <UiInput v-model="numericValue" type="number" label="Seats" :min="1" :max="100" />
          </div>

          <div class="demo-card">
            <UiInput v-model="inputValue" label="With prefix" clearable>
              <template #prefix>@</template>
            </UiInput>
            <UiInput v-model="inputValue" label="With suffix">
              <template #suffix>.ui</template>
            </UiInput>
            <UiInput v-model="inputValue" label="Invalid field" error="Введите уникальное значение" />
          </div>
        </div>
      </section>

      <section class="demo-section">
        <header>
          <p class="eyebrow">Long text</p>
          <h2>UiTextarea</h2>
        </header>

        <div class="demo-grid">
          <div class="demo-card">
            <UiTextarea
              v-model="notes"
              label="Description"
              :maxlength="240"
              show-count
            />
          </div>
          <div class="demo-card">
            <UiTextarea v-model="autoNotes" label="Auto resize" auto-resize />
            <UiTextarea v-model="notes" label="Error state" error="Описание слишком короткое" />
          </div>
        </div>
      </section>

      <section class="demo-section">
        <header>
          <p class="eyebrow">Selection</p>
          <h2>UiSelect</h2>
        </header>

        <div class="demo-grid demo-grid--three">
          <div class="demo-card">
            <UiSelect v-model="singleValue" label="Single" :options="options" clearable />
            <UiSelect
              v-model="multipleValue"
              label="Multiple"
              :options="options"
              multiple
              clearable
            />
          </div>

          <div class="demo-card">
            <UiSelect
              v-model="searchValue"
              label="Searchable"
              :options="options"
              searchable
              clearable
            />
            <UiSelect
              v-model="searchableMultiple"
              label="Searchable multiple"
              :options="options"
              multiple
              searchable
              clearable
            />
          </div>

          <div class="demo-card">
            <UiSelect
              v-model="singleValue"
              label="Loading"
              :options="options"
              loading
            />
            <UiSelect
              v-model="singleValue"
              label="Error"
              :options="options"
              error="Выберите доступный вариант"
            />
            <UiSelect
              :model-value="null"
              label="Empty"
              :options="[]"
              no-options-text="Список пока пуст"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
