import { toast } from '$lib/stores/toasts';
import type { ApiError, ApiResult } from '$lib/types/api';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown,
    public statusCode = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден') {
    super(message, 'NOT_FOUND', undefined, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Необходима авторизация') {
    super(message, 'UNAUTHORIZED', undefined, 401);
    this.name = 'UnauthorizedError';
  }
}

export function handleError(error: unknown, context?: string): void {
  console.error('Error in', context || 'unknown context', ':', error);

  if (error instanceof AppError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(`Произошла ошибка: ${error.message}`);
    return;
  }

  toast.error('Произошла неизвестная ошибка');
}

export function handleApiError(result: ApiResult, context?: string): void {
  if (!result.success) {
    const message = result.error || 'Произошла ошибка при выполнении запроса';
    toast.error(message);
    console.error('API Error in', context || 'unknown context', ':', result);
  }
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

export function createServerError(
  error: unknown,
  defaultMessage = 'Внутренняя ошибка сервера',
): { status: number; body: ApiError } {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
    };
  }

  console.error('Unexpected server error:', error);

  return {
    status: 500,
    body: {
      success: false,
      error: defaultMessage,
      code: 'INTERNAL_ERROR',
    },
  };
}
