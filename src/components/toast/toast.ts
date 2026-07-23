import { inject, type InjectionKey } from 'vue';
import type { UiToastOptions } from './UiToast.types';
export interface UiToastController { push(options: UiToastOptions): string; remove(id: string): void; clear(): void; }
export const uiToastKey: InjectionKey<UiToastController> = Symbol('compact-ui-toast');
export function useToast() {
  const controller = inject(uiToastKey);
  if (!controller) throw new Error('useToast must be used inside UiToastProvider');
  return controller;
}
