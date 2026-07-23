<script setup lang="ts">
import { ref } from 'vue';
import { UiBadge, UiButton, UiCheckbox, UiInput, UiSwitch } from '@compact-ui';

const accent = ref('#7c3aed');
const radius = ref(12);
const enabled = ref(true);
const agreed = ref(false);
const name = ref('Compact UI');
</script>

<template>
  <section
    class="customization-demo"
    :style="{
      '--cui-color-primary': accent,
      '--cui-color-primary-hover': accent,
      '--cui-color-primary-subtle': 'color-mix(in srgb, ' + accent + ' 14%, transparent)',
      '--cui-color-focus': accent,
      '--cui-choice-checked-background': accent,
      '--cui-switch-track-checked-background': accent,
      '--cui-radius-md': radius + 'px',
      '--cui-button-radius': radius + 'px',
      '--cui-input-radius': radius + 'px',
      '--cui-badge-radius': Math.max(4, radius / 2) + 'px',
    }"
  >
    <div class="customization-demo__settings">
      <label>
        Accent
        <input v-model="accent" type="color" />
      </label>
      <label>
        Radius: {{ radius }}px
        <input v-model="radius" type="range" min="0" max="24" />
      </label>
    </div>
    <div class="customization-demo__preview">
      <UiInput v-model="name" label="Название" />
      <UiCheckbox v-model="agreed" label="Использовать локальную тему" />
      <UiSwitch v-model="enabled" label="Компоненты активны" />
      <div>
        <UiBadge tone="primary" dot>Preview</UiBadge>
        <UiButton>Сохранить</UiButton>
      </div>
    </div>
  </section>
</template>
