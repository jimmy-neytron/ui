import type { UiControlSize } from '../../types/common.types';

export type UiRadioValue = string | number;

export interface UiRadioProps<TValue extends UiRadioValue = UiRadioValue> {
  modelValue?: TValue | null;
  value: TValue;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  size?: UiControlSize;
}
