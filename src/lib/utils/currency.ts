import type { CurrencyValue } from '$lib/types/balance';
import { currencyOptions } from '$lib/constants/balance';

export function getCurrencySymbol(currency: CurrencyValue): string {
  const currencyOption = currencyOptions.find(
    (option) => option.value === currency,
  );
  return currencyOption?.symbol || '$';
}

export function formatCurrency(
  amount: number,
  currency: CurrencyValue,
): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyValue,
  toCurrency: CurrencyValue,
  exchangeRates: Record<string, number> = {},
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate =
    fromCurrency === 'USD' ? 1 : exchangeRates[fromCurrency] || 1;
  const toRate = toCurrency === 'USD' ? 1 : exchangeRates[toCurrency] || 1;

  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;

  return Math.round(convertedAmount * 100) / 100;
}
