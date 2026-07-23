export type UiToastTone = 'neutral' | 'success' | 'warning' | 'danger';
export interface UiToastProps { modelValue?: boolean; title?: string; description?: string; tone?: UiToastTone; duration?: number; dismissible?: boolean; closeLabel?: string; }
export interface UiToastOptions extends Omit<UiToastProps, 'modelValue'> { id?: string; }
