import { apiClient } from './api-client';
import type { UserMonthInput } from '$lib/types/api';

export const userMonthService = {
  async createUserMonth(
    monthData: UserMonthInput,
  ): Promise<{ userMonth: { id: string } } | null> {
    return apiClient.safeRequest(
      () =>
        apiClient.post<{ userMonth: { id: string } }>(
          '/user-months',
          monthData,
          {
            loadingKey: 'user-month-create',
          },
        ),
      'createUserMonth',
    );
  },
};
