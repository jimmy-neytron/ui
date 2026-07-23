export type UiAlertTone = 'info' | 'success' | 'warning' | 'danger';
export type UiAlertVariant = 'soft' | 'outline';
export type UiAlertRole = 'status' | 'alert';

export interface UiAlertProps {
  tone?: UiAlertTone;
  variant?: UiAlertVariant;
  title?: string;
  dismissible?: boolean;
  dismissLabel?: string;
  role?: UiAlertRole;
}
