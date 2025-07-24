export type CurrencyValue = 'USD' | 'RUB' | 'GEL' | 'TRY' | 'THB' | 'INR';

export interface BalanceSource {
  id: string;
  name: string;
  currency: CurrencyValue;
  amount: number;
}

export interface Currency {
  value: CurrencyValue;
  label: string;
  symbol: string;
}
