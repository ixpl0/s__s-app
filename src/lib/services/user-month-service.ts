import { apiClient } from './api-client';

export interface UserMonth {
  id: string;
  userId: string;
  year: number;
  month: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserMonthResponse {
  userMonth: UserMonth;
}

export const userMonthService = {
  async createUserMonth(data: { year: number; month: number }) {
    return apiClient.post<UserMonthResponse>(
      '/api/user-months',
      data,
      {
        showSuccessToast: false,
        showErrorToast: true,
      },
    );
  },
};
