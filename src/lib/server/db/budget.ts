import { db } from './index';
import {
  userMonths,
  balanceSources,
  incomeEntries,
  expenseEntries,
} from './schema';
import type { CurrencyValue } from '$lib/types/balance';
import { eq, and, desc } from 'drizzle-orm';

export interface CreateUserMonthData {
  userId: string;
  year: number;
  month: number;
}

export interface CreateBalanceSourceData {
  userMonthId: string;
  name: string;
  currency: CurrencyValue;
  amount: number;
}

export interface CreateIncomeEntryData {
  userMonthId: string;
  description: string;
  amount: number;
  currency: CurrencyValue;
  date: string;
}

export interface CreateExpenseEntryData {
  userMonthId: string;
  description: string;
  amount: number;
  currency: CurrencyValue;
  date: string;
}

export async function createUserMonth(
  data: CreateUserMonthData,
): Promise<(typeof userMonths.$inferSelect)[]> {
  const now = new Date();
  const id = crypto.randomUUID();

  try {
    return await db
      .insert(userMonths)
      .values({
        id,
        userId: data.userId,
        year: data.year,
        month: data.month,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      const existingMonth = await getUserMonth(
        data.userId,
        data.year,
        data.month,
      );
      if (existingMonth) {
        return [existingMonth];
      }
    }
    throw error;
  }
}

export async function getUserMonth(
  userId: string,
  year: number,
  month: number,
): Promise<typeof userMonths.$inferSelect | undefined> {
  return await db
    .select()
    .from(userMonths)
    .where(
      and(
        eq(userMonths.userId, userId),
        eq(userMonths.year, year),
        eq(userMonths.month, month),
      ),
    )
    .get();
}

export async function getUserMonths(
  userId: string,
): Promise<(typeof userMonths.$inferSelect)[]> {
  return await db
    .select()
    .from(userMonths)
    .where(eq(userMonths.userId, userId))
    .orderBy(desc(userMonths.year), desc(userMonths.month))
    .all();
}

export async function updateUserMonth(
  id: string,
  data: Partial<CreateUserMonthData>,
): Promise<(typeof userMonths.$inferSelect)[]> {
  const now = new Date();

  return await db
    .update(userMonths)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(userMonths.id, id))
    .returning();
}

export async function createBalanceSource(
  data: CreateBalanceSourceData,
): Promise<(typeof balanceSources.$inferSelect)[]> {
  const now = new Date();
  const id = crypto.randomUUID();

  return await db
    .insert(balanceSources)
    .values({
      id,
      userMonthId: data.userMonthId,
      name: data.name,
      currency: data.currency,
      amount: data.amount,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
}

export async function getBalanceSourcesByUserMonth(
  userMonthId: string,
): Promise<(typeof balanceSources.$inferSelect)[]> {
  return await db
    .select()
    .from(balanceSources)
    .where(eq(balanceSources.userMonthId, userMonthId))
    .all();
}

export async function updateBalanceSource(
  id: string,
  data: Partial<CreateBalanceSourceData>,
): Promise<(typeof balanceSources.$inferSelect)[]> {
  const now = new Date();

  return await db
    .update(balanceSources)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(balanceSources.id, id))
    .returning();
}

export async function deleteBalanceSource(id: string): Promise<void> {
  await db.delete(balanceSources).where(eq(balanceSources.id, id));
}

export async function saveBalanceSourcesForUserMonth(
  userMonthId: string,
  sources: {
    id?: string;
    name: string;
    currency: CurrencyValue;
    amount: number;
  }[],
): Promise<(typeof balanceSources.$inferSelect)[]> {
  const results = await Promise.all(
    sources.map(async (source) => {
      if (source.id) {
        const existingSource = await db
          .select()
          .from(balanceSources)
          .where(eq(balanceSources.id, source.id))
          .limit(1);

        if (existingSource.length > 0) {
          return await updateBalanceSource(source.id, {
            name: source.name,
            currency: source.currency,
            amount: source.amount,
            userMonthId,
          });
        } else {
          return await db
            .insert(balanceSources)
            .values({
              id: source.id,
              userMonthId,
              name: source.name,
              currency: source.currency,
              amount: source.amount,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();
        }
      } else {
        return await createBalanceSource({
          userMonthId,
          name: source.name,
          currency: source.currency,
          amount: source.amount,
        });
      }
    }),
  );

  return results.flat();
}

export async function createIncomeEntry(
  data: CreateIncomeEntryData,
): Promise<(typeof incomeEntries.$inferSelect)[]> {
  const now = new Date();
  const id = crypto.randomUUID();

  return await db
    .insert(incomeEntries)
    .values({
      id,
      userMonthId: data.userMonthId,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
}

export async function getIncomeEntriesByUserMonth(
  userMonthId: string,
): Promise<(typeof incomeEntries.$inferSelect)[]> {
  return await db
    .select()
    .from(incomeEntries)
    .where(eq(incomeEntries.userMonthId, userMonthId))
    .all();
}

export async function updateIncomeEntry(
  id: string,
  data: Partial<CreateIncomeEntryData>,
): Promise<(typeof incomeEntries.$inferSelect)[]> {
  const now = new Date();

  return await db
    .update(incomeEntries)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(incomeEntries.id, id))
    .returning();
}

export async function deleteIncomeEntry(id: string): Promise<void> {
  await db.delete(incomeEntries).where(eq(incomeEntries.id, id));
}

export async function createExpenseEntry(
  data: CreateExpenseEntryData,
): Promise<(typeof expenseEntries.$inferSelect)[]> {
  const now = new Date();
  const id = crypto.randomUUID();

  return await db
    .insert(expenseEntries)
    .values({
      id,
      userMonthId: data.userMonthId,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
}

export async function getExpenseEntriesByUserMonth(
  userMonthId: string,
): Promise<(typeof expenseEntries.$inferSelect)[]> {
  return await db
    .select()
    .from(expenseEntries)
    .where(eq(expenseEntries.userMonthId, userMonthId))
    .all();
}

export async function updateExpenseEntry(
  id: string,
  data: Partial<CreateExpenseEntryData>,
): Promise<(typeof expenseEntries.$inferSelect)[]> {
  const now = new Date();

  return await db
    .update(expenseEntries)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(expenseEntries.id, id))
    .returning();
}

export async function deleteExpenseEntry(id: string): Promise<void> {
  await db.delete(expenseEntries).where(eq(expenseEntries.id, id));
}
