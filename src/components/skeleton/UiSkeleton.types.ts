export type UiSkeletonVariant = 'text' | 'rect' | 'circle';
export interface UiSkeletonProps {
  variant?: UiSkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
  label?: string;
}
