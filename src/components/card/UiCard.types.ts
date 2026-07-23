export type UiCardVariant = 'elevated' | 'outline' | 'filled';
export type UiCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface UiCardProps {
  as?: string;
  variant?: UiCardVariant;
  padding?: UiCardPadding;
}
