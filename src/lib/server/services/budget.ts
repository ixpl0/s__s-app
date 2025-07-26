import { getUserMonth, createUserMonth, getBalanceSourcesByUserMonth, getIncomeEntriesByUserMonth, getExpenseEntriesByUserMonth, getUserMonths } from '$lib/server/db/budget';
import { convertToUSD } from '$lib/server/services/currency';
import type { MonthData, MonthDataWithDetails } from '$lib/types/budget';
import type { BalanceSource, IncomeEntry, ExpenseEntry, CurrencyValue } from '$lib/types/balance';
import type { BalanceSource as DBBalanceSource, IncomeEntry as DBIncomeEntry, ExpenseEntry as DBExpenseEntry } from '$lib/server/db/schema';

function isCurrencyValue(value: string): value is CurrencyValue {
  return ['USD', 'RUB', 'GEL', 'TRY', 'THB', 'INR'].includes(value);
}

function toCurrencyValue(value: string): CurrencyValue {
  if (isCurrencyValue(value)) {
    return value;
  }

  console.warn(`Unknown currency: ${value}, falling back to USD`);

  return 'USD';
}

export async function getMonthData(userId: string, year: number, month: number): Promise<MonthDataWithDetails | null> {
  let userMonth = await getUserMonth(userId, year, month);

  if (!userMonth) {
    const [created] = await createUserMonth({
      userId,
      year,
      month,
    });

    userMonth = created;
  }

  const [
    balanceSources,
    incomeEntries,
    expenseEntries,
  ] = await Promise.all([
    getBalanceSourcesByUserMonth(userMonth.id),
    getIncomeEntriesByUserMonth(userMonth.id),
    getExpenseEntriesByUserMonth(userMonth.id),
  ]);

  const rateDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const startBalance = await calculateTotalInUSD(balanceSources, rateDate);
  const income = await calculateIncomeInUSD(incomeEntries, rateDate);
  const majorExpenses = await calculateMajorExpensesInUSD(expenseEntries, rateDate);
  const balanceChange = income - majorExpenses;
  const pocketExpenses = 0;

  return {
    month,
    year,
    startBalance,
    balanceChange,
    pocketExpenses,
    income,
    expenses: majorExpenses,
    userMonthId: userMonth.id,
    balanceSources: balanceSources.map(mapDBToBalanceSource),
    incomeEntries: incomeEntries.map(mapDBToIncomeEntry),
    expenseEntries: expenseEntries.map(mapDBToExpenseEntry),
  };
}

export async function getUserMonthsData(userId: string): Promise<MonthData[]> {
  const userMonths = await getUserMonths(userId);

  if (userMonths.length === 0) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsData: MonthData[] = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      monthsData.push({
        month,
        year,
        startBalance: 0,
        balanceChange: 0,
        pocketExpenses: 0,
        income: 0,
        expenses: 0,
        userMonthId: '',
      });
    }

    return monthsData;
  }

  const monthsData = await Promise.all(
    userMonths.map(async (userMonth: { year: number; month: number; }) => {
      const monthData = await getMonthData(userId, userMonth.year, userMonth.month);

      return monthData ? {
        month: monthData.month,
        year: monthData.year,
        startBalance: monthData.startBalance,
        balanceChange: monthData.balanceChange,
        pocketExpenses: monthData.pocketExpenses,
        income: monthData.income,
        expenses: monthData.expenses,
        userMonthId: monthData.userMonthId,
      } : null;
    }),
  );

  return monthsData.filter((data): data is MonthData => data !== null);
}

async function calculateTotalInUSD(sources: DBBalanceSource[], rateDate: string): Promise<number> {
  let total = 0;

  for (const source of sources) {
    total += await convertToUSD(source.amount, toCurrencyValue(source.currency), rateDate);
  }

  return total;
}

async function calculateIncomeInUSD(entries: DBIncomeEntry[], rateDate: string): Promise<number> {
  let total = 0;

  for (const entry of entries) {
    total += await convertToUSD(entry.amount, toCurrencyValue(entry.currency), rateDate);
  }

  return total;
}

async function calculateMajorExpensesInUSD(entries: DBExpenseEntry[], rateDate: string): Promise<number> {
  let total = 0;

  for (const entry of entries) {
    total += await convertToUSD(entry.amount, toCurrencyValue(entry.currency), rateDate);
  }

  return total;
}

function mapDBToBalanceSource(dbSource: DBBalanceSource): BalanceSource {
  return {
    id: dbSource.id,
    userMonthId: dbSource.userMonthId,
    name: dbSource.name,
    currency: toCurrencyValue(dbSource.currency),
    amount: dbSource.amount,
    createdAt: dbSource.createdAt,
    updatedAt: dbSource.updatedAt,
  };
}

function mapDBToIncomeEntry(dbEntry: DBIncomeEntry): IncomeEntry {
  return {
    id: dbEntry.id,
    userMonthId: dbEntry.userMonthId,
    description: dbEntry.description,
    amount: dbEntry.amount,
    currency: toCurrencyValue(dbEntry.currency),
    date: dbEntry.date,
    createdAt: dbEntry.createdAt,
    updatedAt: dbEntry.updatedAt,
  };
}

function mapDBToExpenseEntry(dbEntry: DBExpenseEntry): ExpenseEntry {
  return {
    id: dbEntry.id,
    userMonthId: dbEntry.userMonthId,
    description: dbEntry.description,
    amount: dbEntry.amount,
    currency: toCurrencyValue(dbEntry.currency),
    date: dbEntry.date,
    createdAt: dbEntry.createdAt,
    updatedAt: dbEntry.updatedAt,
  };
}
