<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

const props = withDefaults(defineProps<{
  title?: string;
  description?: string;
  code?: string;
}>(), {
  title: 'Пример',
  description: '',
  code: '',
});

const isCodeVisible = ref(false);
const copyState = ref<'idle' | 'success' | 'error'>('idle');
const sourceCode = computed(() => props.code ? decodeURIComponent(props.code) : '');
const copyLabel = computed(() => {
  if (copyState.value === 'success') return 'Скопировано';
  if (copyState.value === 'error') return 'Не удалось скопировать';
  return 'Копировать';
});

let resetTimer: ReturnType<typeof setTimeout> | undefined;

function copyWithFallback(value: string) {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

async function copyCode() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(sourceCode.value);
    } else if (!copyWithFallback(sourceCode.value)) {
      throw new Error('Clipboard is unavailable');
    }
    copyState.value = 'success';
  } catch {
    copyState.value = 'error';
  }

  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copyState.value = 'idle';
  }, 2000);
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer);
});
</script>

<template>
  <section class="demo-frame">
    <header v-if="title || description" class="demo-frame__header">
      <strong>{{ title }}</strong>
      <span v-if="description">{{ description }}</span>
    </header>

    <div class="demo-frame__content"><slot /></div>

    <div v-if="sourceCode" class="demo-frame__toolbar">
      <button
        class="demo-frame__tool"
        type="button"
        :aria-expanded="isCodeVisible"
        @click="isCodeVisible = !isCodeVisible"
      >
        {{ isCodeVisible ? 'Скрыть код' : 'Показать код' }}
      </button>
      <button
        class="demo-frame__tool"
        type="button"
        :data-state="copyState"
        aria-live="polite"
        @click="copyCode"
      >
        {{ copyLabel }}
      </button>
    </div>

    <div v-if="sourceCode && isCodeVisible" class="demo-frame__source">
      <pre tabindex="0"><code>{{ sourceCode }}</code></pre>
    </div>
  </section>
</template>
