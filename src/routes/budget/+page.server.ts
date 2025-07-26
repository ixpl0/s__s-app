import { getExchangeRatesForDates } from '$lib/server/services/currency';
import { monthsData } from '$lib/constants/budget';

export async function load(): Promise<{
  exchangeRates: Record<string, Record<string, number>>;
}> {
  const dates = [
    ...new Set(
      monthsData.map(
        (month) =>
          `${month.year}-${String(month.month + 1).padStart(2, '0')}-01`,
      ),
    ),
  ];

  try {
    const exchangeRates = await getExchangeRatesForDates(dates);

    return { exchangeRates };
  } catch {
    return { exchangeRates: {} };
  }
}
