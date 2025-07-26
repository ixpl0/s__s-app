import { apiClient } from './api-client';
import type { BalanceSourceInput } from '$lib/types/api';
import type { BalanceSource } from '$lib/types/balance';

export const balanceService = {
  async getBalanceSources(
    userMonthId: string,
  ): Promise<BalanceSource[] | null> {
    return apiClient.safeRequest(
      () =>
        apiClient.get<BalanceSource[]>(
          `/balance-sources?userMonthId=${userMonthId}`,
          {
            loadingKey: 'balance-sources-load',
          },
        ),
      'getBalanceSources',
    );
  },

  async saveBalanceSources(
    userMonthId: string,
    sources: BalanceSourceInput[],
  ): Promise<{ balanceSources: BalanceSource[] } | null> {
    return apiClient.safeRequest(
      () =>
        apiClient.post<{ balanceSources: BalanceSource[] }>(
          '/balance-sources',
          { userMonthId, balanceSources: sources },
          { loadingKey: 'balance-sources-save' },
        ),
      'saveBalanceSources',
    );
  },

  async deleteBalanceSource(id: string): Promise<{ success: boolean } | null> {
    return apiClient.safeRequest(
      () =>
        apiClient.delete<{ success: boolean }>(`/balance-sources/${id}`, {
          loadingKey: 'balance-source-delete',
        }),
      'deleteBalanceSource',
    );
  },
};
