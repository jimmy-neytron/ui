export type UiDividerOrientation = 'horizontal' | 'vertical';
export type UiDividerLabelPosition = 'start' | 'center' | 'end';
export interface UiDividerProps {
  orientation?: UiDividerOrientation;
  labelPosition?: UiDividerLabelPosition;
}
