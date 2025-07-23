export type Currency = 'USD' | 'RUB' | 'GEL' | 'TRY' | 'THB' | 'INR';

export interface BalanceSource {
  id: string;
  name: string;
  currency: Currency;
  amount: number;
}

export interface CurrencyOption {
  value: Currency;
  label: string;
  symbol: string;
}
