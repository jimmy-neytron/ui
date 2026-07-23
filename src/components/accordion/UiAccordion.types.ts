export type UiAccordionValue = string | number;
export interface UiAccordionItem<TValue extends UiAccordionValue = UiAccordionValue> { value: TValue; title: string; content?: string; disabled?: boolean; }
export interface UiAccordionProps<TValue extends UiAccordionValue = UiAccordionValue> {
  modelValue?: TValue | readonly TValue[] | null;
  items: readonly UiAccordionItem<TValue>[];
  multiple?: boolean;
  collapsible?: boolean;
}
