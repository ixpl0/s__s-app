import type { ApiResult, ApiError, ApiResponse } from '$lib/types/api';
import { handleApiError } from '$lib/utils/error-handling';
import { withLoading } from '$lib/stores/loading';

interface RequestOptions extends RequestInit {
  loadingKey?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    const { loadingKey, ...fetchOptions } = options;

    const requestFn = async (): Promise<ApiResult<T>> => {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
          ...fetchOptions,
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json().catch(() => ({
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`,
            code: 'HTTP_ERROR',
          }));

          return errorData;
        }

        const data: ApiResponse<T> = await response.json();
        return data;
      } catch (error) {
        console.error('Network error:', error);
        return {
          success: false,
          error: 'Ошибка сети. Проверьте подключение к интернету.',
          code: 'NETWORK_ERROR',
        };
      }
    };

    if (loadingKey) {
      return withLoading(loadingKey, requestFn);
    }

    return requestFn();
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async safeRequest<T>(
    requestFn: () => Promise<ApiResult<T>>,
    context?: string,
  ): Promise<T | null> {
    try {
      const result = await requestFn();

      if (!result.success) {
        handleApiError(result, context);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('Safe request error:', error);
      handleApiError(
        {
          success: false,
          error: 'Неожиданная ошибка при выполнении запроса',
          code: 'UNEXPECTED_ERROR',
        },
        context,
      );
      return null;
    }
  }
}

export const apiClient = new ApiClient('/api');
