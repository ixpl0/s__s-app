import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const toasts = writable<Toast[]>([]);

export function addToast(message: string, type: Toast['type'] = 'info', duration = 4000): void {
  const id = Math.random().toString(36).substring(2, 9);

  const toast: Toast = {
    id,
    message,
    type,
    duration,
  };

  toasts.update((currentToasts) => [...currentToasts, toast]);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
}

export function removeToast(id: string): void {
  toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
}

export const toast = {
  success: (message: string, duration?: number): void => addToast(message, 'success', duration),
  error: (message: string, duration?: number): void => addToast(message, 'error', duration),
  warning: (message: string, duration?: number): void => addToast(message, 'warning', duration),
  info: (message: string, duration?: number): void => addToast(message, 'info', duration),
};
