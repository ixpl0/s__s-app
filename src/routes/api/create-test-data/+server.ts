import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  createUserMonth,
  createBalanceSource,
  createIncomeEntry,
  createExpenseEntry,
} from '$lib/server/db/budget';
import { saveExchangeRates } from '$lib/server/services/currency';
import { validateSessionToken, sessionCookieName } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const testRates = {
      USD: 1,
      RUB: 95.5,
      GEL: 2.7,
      TRY: 34.2,
      THB: 36.8,
      INR: 83.4,
    };

    await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const date = new Date(currentYear, currentMonth - i, 1);
        const dateString = date.toISOString().split('T')[0];
        return saveExchangeRates(dateString, testRates);
      }),
    );

    const createdMonths = await Promise.all(
      Array.from({ length: 3 }, async (_, i) => {
        const monthDate = new Date(currentYear, currentMonth - i, 1);
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const [userMonth] = await createUserMonth({
          userId: user.id,
          year,
          month,
        });

        return { userMonth, year, month };
      }),
    );

    await Promise.all(
      createdMonths.flatMap(({ userMonth, year, month }) => {
        const balanceSources = [
          {
            name: 'Наличные',
            currency: 'USD' as const,
            amount: 500 + Math.random() * 1000,
          },
          {
            name: 'Банк TBC',
            currency: 'GEL' as const,
            amount: 2000 + Math.random() * 3000,
          },
          {
            name: 'Сбербанк',
            currency: 'RUB' as const,
            amount: 50000 + Math.random() * 100000,
          },
        ];

        const incomes = [
          {
            description: 'Зарплата',
            amount: 3000 + Math.random() * 2000,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-05`,
          },
          {
            description: 'Фриланс',
            amount: 500 + Math.random() * 1000,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
          },
        ];

        const majorExpenses = [
          {
            description: 'Аренда жилья',
            amount: 800 + Math.random() * 400,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
          },
          {
            description: 'Коммунальные услуги',
            amount: 150 + Math.random() * 100,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-10`,
          },
        ];

        const pocketExpenses = [
          {
            description: 'Продукты',
            amount: 300 + Math.random() * 200,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-07`,
          },
          {
            description: 'Транспорт',
            amount: 80 + Math.random() * 50,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-12`,
          },
          {
            description: 'Развлечения',
            amount: 100 + Math.random() * 150,
            currency: 'USD' as const,
            date: `${year}-${String(month + 1).padStart(2, '0')}-20`,
          },
        ];

        return [
          ...balanceSources.map((source) =>
            createBalanceSource({
              userMonthId: userMonth.id,
              name: source.name,
              currency: source.currency,
              amount: source.amount,
            }),
          ),
          ...incomes.map((income) =>
            createIncomeEntry({
              userMonthId: userMonth.id,
              description: income.description,
              amount: income.amount,
              currency: income.currency,
              date: income.date,
            }),
          ),
          ...majorExpenses.map((expense) =>
            createExpenseEntry({
              userMonthId: userMonth.id,
              description: expense.description,
              amount: expense.amount,
              currency: expense.currency,
              date: expense.date,
            }),
          ),
          ...pocketExpenses.map((expense) =>
            createExpenseEntry({
              userMonthId: userMonth.id,
              description: expense.description,
              amount: expense.amount,
              currency: expense.currency,
              date: expense.date,
            }),
          ),
        ];
      }),
    );

    return json({
      message: `Созданы тестовые данные за ${createdMonths.length} месяцев`,
      months: createdMonths,
    });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
