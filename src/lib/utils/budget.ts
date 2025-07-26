import type { CurrencyValue } from '$lib/types/balance';
import { formatCurrency, convertCurrency } from './currency';

export function getBalanceChangeClass(change: number): string {
  if (change > 0) {
    return 'text-success';
  }

  if (change < 0) {
    return 'text-error';
  }

  return '';
}

export function getPocketExpensesClass(
  expenses: number,
  income: number,
): string {
  const percentage = (expenses / income) * 100;

  if (percentage < 7) {
    return 'text-success';
  }

  if (percentage < 14) {
    return 'text-warning';
  }

  return 'text-error';
}

export function formatAmount(
  amount: number,
  baseCurrency: CurrencyValue,
): string {
  return formatCurrency(amount, baseCurrency);
}

export function calculateTotalBalance(
  balanceSources: { currency: CurrencyValue; amount: number }[],
  baseCurrency: CurrencyValue,
  exchangeRates: Record<string, number> = {},
): number {
  const total = balanceSources.reduce((sum, source) => {
    const convertedAmount = convertCurrency(
      source.amount,
      source.currency,
      baseCurrency,
      exchangeRates,
    );
    return sum + convertedAmount;
  }, 0);

  return Math.round(total * 100) / 100;
}
