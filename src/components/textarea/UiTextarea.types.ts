export type UiTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface UiTextareaProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  rows?: number;
  maxlength?: number;
  showCount?: boolean;
  resize?: UiTextareaResize;
  autoResize?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
}
