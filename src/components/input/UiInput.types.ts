import type { HTMLAttributes, InputHTMLAttributes } from 'vue';
import type { UiControlSize } from '../../types/common.types';

export type UiInputModelValue = string | number;

export interface UiInputProps {
  modelValue?: UiInputModelValue;
  type?: InputHTMLAttributes['type'];
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: UiControlSize;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  clearable?: boolean;
  name?: string;
  autocomplete?: string;
  inputmode?: HTMLAttributes['inputmode'];
  min?: string | number;
  max?: string | number;
  step?: string | number;
  maxlength?: number;
  pattern?: string;
}
