import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const exchangeRates = sqliteTable('exchange_rates', {
  date: text('date').primaryKey(), // '2025-07-01'
  rates: text('rates', { mode: 'json' }).notNull(), // '{ USD: 1, GEL: 2.7, … }'
});

export const userMonths = sqliteTable('user_months', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  year: integer('year').notNull(),
  month: integer('month').notNull(), // 0-11
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const balanceSources = sqliteTable('balance_sources', {
  id: text('id').primaryKey(),
  userMonthId: text('user_month_id').notNull().references(() => userMonths.id),
  name: text('name').notNull(),
  currency: text('currency').notNull(), // USD, RUB, GEL, TRY, THB, INR
  amount: real('amount').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const incomeEntries = sqliteTable('income_entries', {
  id: text('id').primaryKey(),
  userMonthId: text('user_month_id').notNull().references(() => userMonths.id),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const expenseEntries = sqliteTable('expense_entries', {
  id: text('id').primaryKey(),
  userMonthId: text('user_month_id').notNull().references(() => userMonths.id),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type User         = typeof user.$inferSelect;
export type Session      = typeof session.$inferSelect;
export type ExchangeRates = typeof exchangeRates.$inferSelect;
export type UserMonth      = typeof userMonths.$inferSelect;
export type BalanceSource  = typeof balanceSources.$inferSelect;
export type IncomeEntry    = typeof incomeEntries.$inferSelect;
export type ExpenseEntry   = typeof expenseEntries.$inferSelect;
