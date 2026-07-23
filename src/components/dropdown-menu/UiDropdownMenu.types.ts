import type { UiOverlayPlacement } from '../tooltip';
export type UiDropdownMenuValue = string | number;
export interface UiDropdownMenuItem<TValue extends UiDropdownMenuValue = UiDropdownMenuValue> { value: TValue; label: string; href?: string; disabled?: boolean; danger?: boolean; }
export interface UiDropdownMenuProps<TValue extends UiDropdownMenuValue = UiDropdownMenuValue> {
  modelValue?: boolean;
  items: readonly UiDropdownMenuItem<TValue>[];
  placement?: UiOverlayPlacement;
  disabled?: boolean;
}
