import type { UiControlSize } from '../../types/common.types';

export interface UiSwitchProps {
  modelValue?: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  size?: UiControlSize;
}
