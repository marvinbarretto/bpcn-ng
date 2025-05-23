import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  sticky: boolean;
  timeout?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts$$ = signal<Toast[]>([]);
  public readonly toasts$ = this.toasts$$.asReadonly();
  private activeTimeouts: Map<string, number> = new Map();

  private push(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    timeout?: number,
    sticky: boolean = false
  ): void {
    const newToast: Toast = {
      id: uuid(),
      message,
      type,
      sticky,
      timeout,
    };
    this.toasts$$.update((toasts) => [...toasts, newToast]);

    if (!sticky && timeout) {
      const timeoutId = window.setTimeout(() => {
        this.dismiss(newToast.id);
        // No need to remove from activeTimeouts here, dismiss() will handle it
      }, timeout);
      this.activeTimeouts.set(newToast.id, timeoutId);
    }
  }

  success(message: string, timeout: number = 3000, sticky: boolean = false): void {
    this.push(message, 'success', timeout, sticky);
  }

  error(message: string, timeout: number = 5000, sticky: boolean = false): void {
    this.push(message, 'error', timeout, sticky);
  }

  warning(message: string, timeout: number = 4000, sticky: boolean = false): void {
    this.push(message, 'warning', timeout, sticky);
  }

  info(message: string, timeout: number = 3000, sticky: boolean = false): void {
    this.push(message, 'info', timeout, sticky);
  }

  dismiss(id: string): void {
    if (this.activeTimeouts.has(id)) {
      clearTimeout(this.activeTimeouts.get(id));
      this.activeTimeouts.delete(id);
    }
    this.toasts$$.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clearAll(): void {
    this.activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.activeTimeouts.clear();
    this.toasts$$.set([]);
  }
}
