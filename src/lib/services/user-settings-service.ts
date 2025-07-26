import { safeRequest } from './api-client';
import type { CurrencyValue } from '$lib/types/balance';

export const userSettingsService = {
  async getUserSettings() {
    return safeRequest<{ settings: { baseCurrency: CurrencyValue } }>(
      '/api/user-settings',
      {
        method: 'GET',
      },
    );
  },

  async updateUserSettings(baseCurrency: CurrencyValue) {
    return safeRequest<{ settings: { baseCurrency: CurrencyValue } }>(
      '/api/user-settings',
      {
        method: 'PUT',
        body: JSON.stringify({ baseCurrency }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
  },
};
