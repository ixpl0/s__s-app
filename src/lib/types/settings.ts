import type { CurrencyValue } from './balance';

export interface UserSettings {
  id: string;
  userId: string;
  baseCurrency: CurrencyValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettingsUpdate {
  baseCurrency: CurrencyValue;
}
