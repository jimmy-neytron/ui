import type { ButtonHTMLAttributes } from 'vue';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';

export interface UiButtonProps {
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  type?: ButtonHTMLAttributes['type'];
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  ariaLabel?: string;
}
