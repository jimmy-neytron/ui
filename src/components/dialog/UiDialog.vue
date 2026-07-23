<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useStableId } from '../../composables/useStableId';
import { useUiLocale } from '../../config/locale';
import type { UiDialogProps } from './UiDialog.types';

defineOptions({ name: 'UiDialog' });

const props = withDefaults(defineProps<UiDialogProps>(), {
  modelValue: false,
  size: 'md',
  animation: 'scale',
  forceMotion: false,
  closeOnEscape: true,
  closeOnBackdrop: true,
  showClose: true,
  teleport: true,
});
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [reason: 'escape' | 'backdrop' | 'button'];
}>();
const locale = useUiLocale();
const dialogRef = ref<HTMLElement | null>(null);
const titleId = useStableId('dialog-title');
const descriptionId = useStableId('dialog-description');
const resolvedTransitionName = computed(() => props.transitionName ?? `cui-dialog-${props.animation}`);
let restoreFocus: HTMLElement | null = null;
const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function close(reason: 'escape' | 'backdrop' | 'button') {
  emit('update:modelValue', false);
  emit('close', reason);
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault();
    close('escape');
    return;
  }
  if (event.key !== 'Tab' || !dialogRef.value) return;
  const focusable = [...dialogRef.value.querySelectorAll<HTMLElement>(focusableSelector)];
  if (!focusable.length) {
    event.preventDefault();
    dialogRef.value.focus();
    return;
  }
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function backdrop(event: MouseEvent) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) close('backdrop');
}

watch(() => props.modelValue, async (open) => {
  if (typeof document === 'undefined') return;
  if (open) {
    restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    await nextTick();
    const initial = dialogRef.value?.querySelector<HTMLElement>('[autofocus]')
      ?? dialogRef.value?.querySelector<HTMLElement>(focusableSelector)
      ?? dialogRef.value;
    initial?.focus();
  } else {
    restoreFocus?.focus();
    restoreFocus = null;
  }
}, { immediate: true });
</script>

<template>
  <Teleport to="body" :disabled="!teleport">
    <Transition
      :name="resolvedTransitionName"
      :css="animation !== 'none' || Boolean(transitionName)"
      appear
    >
      <div
        v-show="modelValue"
        class="cui-dialog__backdrop"
        :data-force-motion="forceMotion || undefined"
        @mousedown="backdrop"
      >
        <section
          ref="dialogRef"
          class="cui-dialog"
          role="dialog"
          aria-modal="true"
          :data-size="size"
          :data-animation="animation"
          :aria-labelledby="title || $slots.title ? titleId : undefined"
          :aria-describedby="description ? descriptionId : undefined"
          tabindex="-1"
          @keydown="keydown"
        >
          <header v-if="title || $slots.title || description || showClose" class="cui-dialog__header">
            <div v-if="title || $slots.title || description" class="cui-dialog__heading">
              <h2 v-if="title || $slots.title" :id="titleId" class="cui-dialog__title">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="description" :id="descriptionId" class="cui-dialog__description">
                {{ description }}
              </p>
            </div>
            <button
              v-if="showClose"
              class="cui-dialog__close"
              type="button"
              :aria-label="closeLabel ?? locale.close"
              @click="close('button')"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="m5.5 5.5 9 9m0-9-9 9" />
              </svg>
            </button>
          </header>
          <div class="cui-dialog__body"><slot /></div>
          <footer v-if="$slots.footer" class="cui-dialog__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>