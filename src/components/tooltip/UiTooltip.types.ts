export type UiOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface UiTooltipProps {
  content?: string;
  placement?: UiOverlayPlacement;
  delay?: number;
  disabled?: boolean;
  autoPlacement?: boolean;
  boundaryPadding?: number;
  teleport?: boolean;
}