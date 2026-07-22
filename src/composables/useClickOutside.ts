import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from 'vue';

export function useClickOutside(
  target: MaybeRefOrGetter<HTMLElement | null>,
  handler: (event: PointerEvent) => void,
) {
  const onPointerDown = (event: PointerEvent) => {
    const element = toValue(target);
    const eventTarget = event.target;

    if (!element || !(eventTarget instanceof Node) || element.contains(eventTarget)) {
      return;
    }

    handler(event);
  };

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown);
  });
}
