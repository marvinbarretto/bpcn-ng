import { Injectable, inject, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { SsrPlatformService } from '../utils/ssr/ssr-platform.service';

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  sticky: boolean;
  timeout?: number;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts$$ = signal<Toast[]>([]);
  readonly toasts$$Readonly = this.toasts$$.asReadonly();

  private readonly activeTimeouts = new Map<string, number>();
  private readonly platform = inject(SsrPlatformService);

  private push(
    message: string,
    type: Toast['type'],
    timeout?: number,
    sticky = false
  ): void {
    const toast: Toast = {
      id: uuid(),
      message,
      type,
      sticky,
      timeout,
    };

    console.log('[ToastService] Adding toast:', toast);
    this.toasts$$.update((current) => [toast, ...current]);

    if (!sticky && timeout) {
      const win = this.platform.getWindow();
      if (!win) {
        console.warn('[ToastService] No window object – toast timeout skipped (SSR?)');
        return;
      }

      const timeoutId = win.setTimeout(() => {
        console.log(`[ToastService] Auto-dismissing toast: ${toast.id}`);
        this.dismiss(toast.id);
      }, timeout);

      this.activeTimeouts.set(toast.id, timeoutId);
    }
  }

  success(message: string, timeout = 130000, sticky = false): void {
    this.push(message, 'success', timeout, sticky);
  }

  error(message: string, timeout = 5000, sticky = false): void {
    this.push(message, 'error', timeout, sticky);
  }

  warning(message: string, timeout = 4000, sticky = false): void {
    this.push(message, 'warning', timeout, sticky);
  }

  info(message: string, timeout = 3000, sticky = false): void {
    this.push(message, 'info', timeout, sticky);
  }

  dismiss(id: string): void {
    console.log('[ToastService] Dismissing toast:', id);

    if (this.activeTimeouts.has(id)) {
      clearTimeout(this.activeTimeouts.get(id));
      this.activeTimeouts.delete(id);
    }

    this.toasts$$.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clearAll(): void {
    console.log('[ToastService] Clearing all toasts');

    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts.clear();

    this.toasts$$.set([]);
  }
}
