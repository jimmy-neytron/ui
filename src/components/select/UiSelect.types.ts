import type { UiControlSize } from '../../types/common.types';

export type UiSelectValue = string | number;
export type UiSelectSingleValue<TValue extends UiSelectValue = UiSelectValue> = TValue | null;
export type UiSelectMultipleValue<TValue extends UiSelectValue = UiSelectValue> = TValue[];
export type UiSelectModelValue<TValue extends UiSelectValue = UiSelectValue> =
  | UiSelectSingleValue<TValue>
  | UiSelectMultipleValue<TValue>;

export interface UiSelectOption<TValue extends UiSelectValue = UiSelectValue> {
  label: string;
  value: TValue;
  disabled?: boolean;
}

export interface UiSelectProps<TValue extends UiSelectValue = UiSelectValue> {
  modelValue?: UiSelectModelValue<TValue>;
  options: readonly UiSelectOption<TValue>[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noOptionsText?: string;
  noResultsText?: string;
  name?: string;
  size?: UiControlSize;
  closeOnSelect?: boolean;
  maxMenuHeight?: string | number;
}
