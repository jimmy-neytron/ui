<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useStableId } from '../../composables/useStableId';
import type { UiOverlayPlacement, UiTooltipProps } from './UiTooltip.types';

defineOptions({ name: 'UiTooltip' });

const props = withDefaults(defineProps<UiTooltipProps>(), {
  placement: 'top',
  delay: 300,
  disabled: false,
  autoPlacement: true,
  boundaryPadding: 8,
  teleport: true,
});
const id = useStableId('tooltip');
const root = ref<HTMLElement | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const open = ref(false);
const resolvedPlacement = ref<UiOverlayPlacement>(props.placement);
const tooltipStyle = ref<Record<string, string>>({});
let timer: ReturnType<typeof setTimeout> | undefined;
let cleanupAutoUpdate: (() => void) | undefined;
const gap = 8;

function coordinates(
  placement: UiOverlayPlacement,
  anchor: DOMRect,
  floating: DOMRect,
): { top: number; left: number } {
  if (placement === 'top') {
    return { top: anchor.top - floating.height - gap, left: anchor.left + (anchor.width - floating.width) / 2 };
  }
  if (placement === 'bottom') {
    return { top: anchor.bottom + gap, left: anchor.left + (anchor.width - floating.width) / 2 };
  }
  if (placement === 'left') {
    return { top: anchor.top + (anchor.height - floating.height) / 2, left: anchor.left - floating.width - gap };
  }
  return { top: anchor.top + (anchor.height - floating.height) / 2, left: anchor.right + gap };
}

function overflowScore(position: { top: number; left: number }, floating: DOMRect, padding: number) {
  return Math.max(0, padding - position.left)
    + Math.max(0, padding - position.top)
    + Math.max(0, position.left + floating.width + padding - window.innerWidth)
    + Math.max(0, position.top + floating.height + padding - window.innerHeight);
}

function updatePosition() {
  const anchorRect = (root.value as HTMLElement).getBoundingClientRect();
  const tooltipRect = (tooltip.value as HTMLElement).getBoundingClientRect();
  const opposite: Record<UiOverlayPlacement, UiOverlayPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  const perpendicular: Record<UiOverlayPlacement, readonly UiOverlayPlacement[]> = {
    top: ['right', 'left'],
    bottom: ['right', 'left'],
    left: ['top', 'bottom'],
    right: ['top', 'bottom'],
  };
  const candidates = props.autoPlacement
    ? [props.placement, opposite[props.placement], ...perpendicular[props.placement]]
    : [props.placement];
  const padding = Math.max(0, props.boundaryPadding);
  let bestPlacement = candidates[0] as UiOverlayPlacement;
  let bestPosition = coordinates(bestPlacement, anchorRect, tooltipRect);
  let bestScore = overflowScore(bestPosition, tooltipRect, padding);

  for (const candidate of candidates.slice(1)) {
    const position = coordinates(candidate, anchorRect, tooltipRect);
    const score = overflowScore(position, tooltipRect, padding);
    if (score < bestScore) {
      bestPlacement = candidate;
      bestPosition = position;
      bestScore = score;
    }
  }

  const maxLeft = Math.max(padding, window.innerWidth - tooltipRect.width - padding);
  const maxTop = Math.max(padding, window.innerHeight - tooltipRect.height - padding);
  resolvedPlacement.value = bestPlacement;
  tooltipStyle.value = {
    left: `${Math.min(Math.max(bestPosition.left, padding), maxLeft)}px`,
    top: `${Math.min(Math.max(bestPosition.top, padding), maxTop)}px`,
  };
}

function scrollParents(element: HTMLElement): EventTarget[] {
  const parents: EventTarget[] = [window];
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)) {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}

function stopAutoUpdate() {
  cleanupAutoUpdate?.();
  cleanupAutoUpdate = undefined;
}

function startAutoUpdate() {
  stopAutoUpdate();
  const anchor = root.value as HTMLElement;
  const floating = tooltip.value as HTMLElement;
  const parents = scrollParents(anchor);
  const refresh = () => updatePosition();

  parents.forEach((parent) => parent.addEventListener('scroll', refresh, { passive: true }));
  window.addEventListener('resize', refresh, { passive: true });
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(refresh);
  observer?.observe(anchor);
  observer?.observe(floating);
  updatePosition();

  cleanupAutoUpdate = () => {
    parents.forEach((parent) => parent.removeEventListener('scroll', refresh));
    window.removeEventListener('resize', refresh);
    observer?.disconnect();
  };
}

function show() {
  if (props.disabled) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    open.value = true;
  }, Math.max(0, props.delay));
}

function hide() {
  clearTimeout(timer);
  open.value = false;
}

watch(open, async (visible) => {
  if (!visible) {
    stopAutoUpdate();
    return;
  }
  await nextTick();
  startAutoUpdate();
});
watch(() => [props.placement, props.autoPlacement, props.boundaryPadding], () => {
  if (open.value) updatePosition();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
  stopAutoUpdate();
});
</script>

<template>
  <span
    ref="root"
    class="cui-overlay-anchor"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown.esc="hide"
  >
    <span class="cui-overlay-trigger" :aria-describedby="open ? id : undefined">
      <slot name="trigger" />
    </span>
    <Teleport to="body" :disabled="!teleport">
      <span
        v-if="open"
        :id="id"
        ref="tooltip"
        class="cui-tooltip"
        role="tooltip"
        :data-placement="resolvedPlacement"
        :style="tooltipStyle"
      >
        <slot>{{ content }}</slot>
      </span>
    </Teleport>
  </span>
</template>