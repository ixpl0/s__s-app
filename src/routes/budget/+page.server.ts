import type { PageServerLoad } from './$types';
import {
  getUserMonths,
  getBalanceSourcesByUserMonth,
} from '$lib/server/db/budget';
import { getExchangeRates } from '$lib/server/services/currency';
import type { MonthData } from '$lib/types/budget';
import type { CurrencyValue } from '$lib/types/balance';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      monthsData: [],
      exchangeRates: {},
    };
  }

  try {
    const userMonths = await getUserMonths(locals.user.id);

    const dates = userMonths.map(
      (month) => `${month.year}-${String(month.month + 1).padStart(2, '0')}-01`,
    );

    const exchangeRates = await getExchangeRates(dates);

    const monthsData: MonthData[] = await Promise.all(
      userMonths.map(async (userMonth) => {
        const balanceSources = await getBalanceSourcesByUserMonth(userMonth.id);

        return {
          month: userMonth.month,
          year: userMonth.year,
          userMonthId: userMonth.id,
          balanceSources: balanceSources.map((source) => ({
            id: source.id,
            name: source.name,
            currency: source.currency as CurrencyValue,
            amount: source.amount,
          })),
          // Remove calculated fields - will be computed on frontend
          balanceChange: 0,
          pocketExpenses: 0,
          income: 0,
          expenses: 0,
        };
      }),
    );

    monthsData.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });

    return {
      monthsData,
      exchangeRates,
    };
  } catch (error) {
    console.error('Error loading budget data:', error);
    return {
      monthsData: [],
      exchangeRates: {},
    };
  }
};
