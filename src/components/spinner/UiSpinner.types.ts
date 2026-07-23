import type { UiControlSize } from '../../types/common.types';

export type UiSpinnerTone = 'current' | 'primary' | 'muted' | 'inverted';

export interface UiSpinnerProps {
  size?: UiControlSize;
  tone?: UiSpinnerTone;
  label?: string;
  decorative?: boolean;
}
