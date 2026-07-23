import type { UiControlSize } from '../../types/common.types';
export interface UiPaginationProps {
  modelValue?: number;
  total: number;
  pageSize?: number;
  siblingCount?: number;
  disabled?: boolean;
  size?: UiControlSize;
  ariaLabel?: string;
}
