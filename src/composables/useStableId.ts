import { computed, toValue, useId, type MaybeRefOrGetter } from 'vue';

export function useStableId(
  prefix: string,
  explicitId?: MaybeRefOrGetter<string | undefined>,
) {
  const vueId = useId();

  return computed(() => {
    const providedId = explicitId ? toValue(explicitId) : undefined;
    return providedId ?? `cui-${prefix}-${vueId.replaceAll(':', '')}`;
  });
}
