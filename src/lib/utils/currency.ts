import type { CurrencyValue } from '$lib/types/balance';
import { currencyOptions } from '$lib/constants/balance';

export function getCurrencySymbol(currencyValue: CurrencyValue): string {
  return currencyOptions.find(({ value }) => value === currencyValue)?.symbol
    ?? currencyOptions[0]?.symbol
    ?? '$';
}
