import type { UiControlSize } from '../../types/common.types';

export type UiProgressTone = 'primary' | 'success' | 'warning' | 'danger';
export type UiProgressValueFormatter = (value: number, min: number, max: number) => string;

export interface UiProgressProps {
  value?: number | null;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: UiProgressValueFormatter;
  size?: UiControlSize;
  tone?: UiProgressTone;
}
