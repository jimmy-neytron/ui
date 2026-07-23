<script setup lang="ts">
import { provide, ref } from 'vue';
import UiToast from './UiToast.vue';
import { uiToastKey } from './toast';
import type { UiToastOptions } from './UiToast.types';

defineOptions({ name: 'UiToastProvider' });

const toasts = ref<(Required<Pick<UiToastOptions, 'id'>> & UiToastOptions)[]>([]);
let sequence = 0;

function remove(id: string) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function push(options: UiToastOptions) {
  const id = options.id ?? `cui-toast-${++sequence}`;
  toasts.value.push({ ...options, id });
  return id;
}

function clear() {
  toasts.value = [];
}

provide(uiToastKey, { push, remove, clear });
</script>

<template>
  <slot />
  <Teleport to="body">
    <div class="cui-toast-viewport" aria-label="Notifications">
      <TransitionGroup name="cui-toast">
        <UiToast
          v-for="toast in toasts"
          :key="toast.id"
          v-bind="toast"
          @close="remove(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>