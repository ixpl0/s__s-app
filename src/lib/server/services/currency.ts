import type { CurrencyValue } from '$lib/types/balance';
import { db } from '$lib/server/db';
import { exchangeRates } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';

export type ExchangeRateData = Record<string, number>;

const cache = new Map<string, ExchangeRateData>();

export async function getExchangeRates(
  date: string | string[],
): Promise<Record<string, ExchangeRateData>> {
  const dates = Array.isArray(date) ? date : [date];
  const result: Record<string, ExchangeRateData> = {};
  const datesToFetch: string[] = [];

  // Check cache first for all dates
  dates.forEach((singleDate) => {
    if (cache.has(singleDate)) {
      const cachedRates = cache.get(singleDate);
      if (cachedRates) {
        result[singleDate] = cachedRates;
      }
    } else {
      datesToFetch.push(singleDate);
    }
  });

  // Fetch missing dates from database
  if (datesToFetch.length > 0) {
    try {
      const dbResults = await db
        .select()
        .from(exchangeRates)
        .where(inArray(exchangeRates.date, datesToFetch));

      dbResults.forEach((dbResult) => {
        result[dbResult.date] = dbResult.rates as ExchangeRateData;
      });
    } catch {
      // Continue with what we have from cache
    }
  }

  // Parse all rates from strings to objects and cache them
  const parsedResult = Object.entries(result).reduce(
    (acc, [dateKey, rates]) => {
      let parsedRates: ExchangeRateData;

      if (typeof rates === 'string') {
        try {
          parsedRates = JSON.parse(rates);
        } catch {
          parsedRates = {};
        }
      } else {
        parsedRates = rates;
      }

      acc[dateKey] = parsedRates;
      cache.set(dateKey, parsedRates);
      return acc;
    },
    {} as Record<string, ExchangeRateData>,
  );

  return parsedResult;
}

export async function convertToUSD(
  amount: number,
  fromCurrency: CurrencyValue,
  date: string,
): Promise<number> {
  if (fromCurrency === 'USD') {
    return amount;
  }

  const ratesResult = await getExchangeRates(date);
  const rates = ratesResult[date];

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

  const ratesResult = await getExchangeRates(date);
  const rates = ratesResult[date];

  if (!rates || !rates[toCurrency]) {
    return amount;
  }

  return amount * rates[toCurrency];
}

export async function saveExchangeRates(
  date: string,
  rates: ExchangeRateData,
): Promise<void> {
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
