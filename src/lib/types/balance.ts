export type CurrencyValue = 'USD' | 'RUB' | 'GEL' | 'TRY' | 'THB' | 'INR';

export interface BalanceSource {
  id: string;
  userMonthId?: string;
  name: string;
  currency: CurrencyValue;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Currency {
  value: CurrencyValue;
  label: string;
  symbol: string;
}

export interface IncomeEntry {
  id: string;
  userMonthId: string;
  description: string;
  amount: number;
  currency: CurrencyValue;
  date: string; // YYYY-MM-DD
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseEntry {
  id: string;
  userMonthId: string;
  description: string;
  amount: number;
  currency: CurrencyValue;
  date: string; // YYYY-MM-DD
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserMonth {
  id: string;
  userId: string;
  year: number;
  month: number; // 0-11
  createdAt?: Date;
  updatedAt?: Date;
}
