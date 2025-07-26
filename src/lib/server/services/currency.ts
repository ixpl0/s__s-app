import type { CurrencyValue } from '$lib/types/balance';
import { db } from '$lib/server/db';
import { exchangeRates } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';

export type ExchangeRateData = Record<string, number>;

const cache = new Map<string, ExchangeRateData>();

export async function getExchangeRates(date: string): Promise<ExchangeRateData | null> {
  if (cache.has(date)) {
    const cachedResult = cache.get(date);

    return cachedResult || null;
  }

  try {
    const result = await db
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.date, date))
      .get();

    if (result) {
      const rates = result.rates as ExchangeRateData;

      cache.set(date, rates);

      return rates;
    }

    return null;
  } catch {
    return null;
  }
}

export async function convertToUSD(
  amount: number,
  fromCurrency: CurrencyValue,
  date: string,
): Promise<number> {
  if (fromCurrency === 'USD') {
    return amount;
  }

  const rates = await getExchangeRates(date);

  if (!rates || !rates[fromCurrency]) {
    return amount;
  }

  return amount / rates[fromCurrency];
}

export async function convertFromUSD(
  amount: number,
  toCurrency: CurrencyValue,
  date: string,
): Promise<number> {
  if (toCurrency === 'USD') {
    return amount;
  }

  const rates = await getExchangeRates(date);

  if (!rates || !rates[toCurrency]) {
    return amount;
  }

  return amount * rates[toCurrency];
}

export async function saveExchangeRates(date: string, rates: ExchangeRateData): Promise<void> {
  await db
    .insert(exchangeRates)
    .values({
      date,
      rates,
    })
    .onConflictDoUpdate({
      target: exchangeRates.date,
      set: {
        rates,
      },
    });

  cache.set(date, rates);
}

export function clearCache(): void {
  cache.clear();
}

export async function getExchangeRatesForDates(dates: string[]): Promise<Record<string, Record<string, number>>> {
  try {
    const results = await db
      .select()
      .from(exchangeRates)
      .where(inArray(exchangeRates.date, dates));

    const ratesMap: Record<string, Record<string, number>> = {};

    for (const result of results) {
      ratesMap[result.date] = result.rates as Record<string, number>;
    }

    return ratesMap;
  } catch {
    return {};
  }
}
