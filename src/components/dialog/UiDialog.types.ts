export type UiDialogSize = 'sm' | 'md' | 'lg' | 'full';
export type UiDialogAnimation = 'scale' | 'fade' | 'slide-up' | 'none';

export interface UiDialogProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  size?: UiDialogSize;
  animation?: UiDialogAnimation;
  transitionName?: string;
  forceMotion?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  teleport?: boolean;
  closeLabel?: string;
}