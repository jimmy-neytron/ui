import type { UiControlSize } from '../../types/common.types';

export type UiBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type UiBadgeVariant = 'soft' | 'solid' | 'outline';

export interface UiBadgeProps {
  tone?: UiBadgeTone;
  variant?: UiBadgeVariant;
  size?: UiControlSize;
  dot?: boolean;
}
