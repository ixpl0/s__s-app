import { writable } from 'svelte/store';

type LoadingState = Record<string, boolean>;

const loadingStore = writable<LoadingState>({});

export const loading = {
  subscribe: loadingStore.subscribe,

  start: (key: string): void => {
    loadingStore.update((state) => ({ ...state, [key]: true }));
  },

  stop: (key: string): void => {
    loadingStore.update((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...newState } = state;
      return newState;
    });
  },

  isLoading: (key: string): boolean => {
    let isLoading = false;
    loadingStore.subscribe((state) => {
      isLoading = state[key] || false;
    })();
    return isLoading;
  },

  clear: (): void => {
    loadingStore.set({});
  },
};

export async function withLoading<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  loading.start(key);
  try {
    return await fn();
  } finally {
    loading.stop(key);
  }
}
