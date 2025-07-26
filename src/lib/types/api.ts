import { z } from 'zod';

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResult<T = unknown> = ApiResponse<T> | ApiError;

export const balanceSourceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Введите имя источника'),
  currency: z.enum(['USD', 'RUB', 'GEL', 'TRY', 'THB', 'INR']),
  amount: z.number(),
});

export const userMonthSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(0).max(11),
});

export const exchangeRateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rates: z.record(z.string(), z.number().positive()),
});

export type BalanceSourceInput = z.infer<typeof balanceSourceSchema>;
export type UserMonthInput = z.infer<typeof userMonthSchema>;
export type ExchangeRateData = z.infer<typeof exchangeRateSchema>;

export function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createApiError(
  error: string,
  code?: string,
  details?: unknown,
): ApiError {
  return {
    success: false,
    error,
    code,
    details,
  };
}

export function isApiError(result: ApiResult): result is ApiError {
  return !result.success;
}

export function isApiResponse<T>(
  result: ApiResult<T>,
): result is ApiResponse<T> {
  return result.success;
}
