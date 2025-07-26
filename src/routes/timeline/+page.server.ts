import type { PageServerLoad } from './$types';
import { validateSessionToken, sessionCookieName } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { getUserMonthsData } from '$lib/server/services/budget';
import { getExchangeRates } from '$lib/server/services/currency';

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    throw redirect(302, '/demo/lucia/login');
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    throw redirect(302, '/demo/lucia/login');
  }

  try {
    const monthsData = await getUserMonthsData(user.id);
    const exchangeRates: Record<string, Record<string, number>> = {};

    for (const monthData of monthsData) {
      const rateDate = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-01`;
      const rates = await getExchangeRates(rateDate);

      if (rates) {
        exchangeRates[rateDate] = rates;
      }
    }

    return {
      monthsData,
      exchangeRates,
      user,
    };
  } catch {
    return {
      monthsData: [],
      exchangeRates: {},
      user,
    };
  }
};
