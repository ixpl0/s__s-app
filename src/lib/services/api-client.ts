import { toast } from '$lib/stores/toasts';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

class ApiClient {
  private baseUrl = '';

  async makeRequest<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      showSuccessToast = false,
      showErrorToast = true,
      successMessage,
    } = options;

    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorMsg = ['HTTP', response.status, response.statusText]
          .filter(Boolean)
          .join(' ');

        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      return { data, success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (showErrorToast) {
        toast.error(`Ошибка запроса: ${errorMessage}`);
      }

      return { error: errorMessage, success: false };
    }
  }

  async get<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options, method: 'POST', body,
    });
  }

  async put<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options, method: 'PUT', body,
    });
  }

  async delete<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
