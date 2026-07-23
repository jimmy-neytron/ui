import type { UiControlSize } from '../../types/common.types';
export type UiAvatarShape = 'circle' | 'rounded' | 'square';
export type UiAvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export interface UiAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: UiControlSize;
  shape?: UiAvatarShape;
  status?: UiAvatarStatus;
}
