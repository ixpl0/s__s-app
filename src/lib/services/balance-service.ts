import { apiClient } from './api-client';
import type { BalanceSource } from '$lib/types/balance';

export interface BalanceSourcesResponse {
  balanceSources: BalanceSource[];
}

export interface BalanceSourceResponse {
  balanceSource: BalanceSource;
}

export const balanceService = {
  async getBalanceSources(userMonthId: string) {
    return apiClient.get<BalanceSourcesResponse>(
      `/api/balance-sources?userMonthId=${userMonthId}`,
      {
        showErrorToast: true,
      },
    );
  },

  async createBalanceSource(data: {
    userMonthId: string;
    name: string;
    currency: string;
    amount: number;
  }) {
    return apiClient.post<BalanceSourceResponse>(
      '/api/balance-sources',
      data,
      {
        showSuccessToast: false,
        showErrorToast: true,
      },
    );
  },

  async updateBalanceSource(id: string, data: {
    name: string;
    currency: string;
    amount: number;
  }) {
    return apiClient.put<BalanceSourceResponse>(
      '/api/balance-sources',
      { id, ...data },
      {
        showSuccessToast: false,
        showErrorToast: true,
      },
    );
  },

  async deleteBalanceSource(id: string) {
    return apiClient.delete(
      `/api/balance-sources?id=${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Источник удален',
        showErrorToast: true,
      },
    );
  },
};
