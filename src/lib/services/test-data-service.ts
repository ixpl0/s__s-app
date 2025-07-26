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
  async createTestData(): Promise<void> {
    await apiClient.safeRequest(
      () =>
        apiClient.post('/create-test-data', undefined, {
          loadingKey: 'test-data-create',
        }),
      'createTestData',
    );
  },
};
