import type { UiControlSize } from '../../types/common.types';

export interface UiCheckboxProps {
  modelValue?: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string | number;
  size?: UiControlSize;
}
