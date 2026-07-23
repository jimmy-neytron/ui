import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type InjectionKey,
} from 'vue';

export interface UiLocaleMessages {
  close: string;
  dismiss: string;
  clearInput: string;
  clearSelection: string;
  loading: string;
  searchOptions: string;
  selectOption: string;
  noOptions: string;
  noResults: string;
  removeOption: string;
  previousPage: string;
  nextPage: string;
  openMenu: string;
}

export const defaultUiLocale: Readonly<UiLocaleMessages> = {
  close: 'Close',
  dismiss: 'Dismiss',
  clearInput: 'Clear input',
  clearSelection: 'Clear selection',
  loading: 'Loading',
  searchOptions: 'Search options',
  selectOption: 'Select an option',
  noOptions: 'No options',
  noResults: 'No results',
  removeOption: 'Remove',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  openMenu: 'Open menu',
};

const uiLocaleKey: InjectionKey<ComputedRef<UiLocaleMessages>> = Symbol('compact-ui-locale');

export function provideUiLocale(
  locale: MaybeRefOrGetter<Partial<UiLocaleMessages> | undefined>,
) {
  const messages = computed(() => ({ ...defaultUiLocale, ...toValue(locale) }));
  provide(uiLocaleKey, messages);
  return messages;
}

export function useUiLocale() {
  return inject(uiLocaleKey, computed(() => ({ ...defaultUiLocale })));
}
