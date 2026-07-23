export type UiTabsValue = string | number;
export type UiTabsOrientation = 'horizontal' | 'vertical';
export type UiTabsActivation = 'automatic' | 'manual';
export interface UiTabItem<TValue extends UiTabsValue = UiTabsValue> { value: TValue; label: string; panel?: string; disabled?: boolean; }
export interface UiTabsProps<TValue extends UiTabsValue = UiTabsValue> {
  modelValue: TValue;
  items: readonly UiTabItem<TValue>[];
  orientation?: UiTabsOrientation;
  activation?: UiTabsActivation;
  ariaLabel?: string;
}
