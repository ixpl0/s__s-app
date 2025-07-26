import { apiClient } from './api-client';

export interface TestDataResponse {
  message: string;
  months: {
    year: number;
    month: number;
    userMonthId: string;
  }[];
}

export const testDataService = {
  async createTestData() {
    return apiClient.post<TestDataResponse>(
      '/api/create-test-data',
      undefined,
      {
        showSuccessToast: true,
        successMessage: 'Тестовые данные созданы успешно!',
        showErrorToast: true,
      },
    );
  },
};
