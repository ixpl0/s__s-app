import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

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
  date: text('date').primaryKey(),                  // '2025-07-01'
  rates: text('rates', { mode: 'json' }).notNull(), // { USD: 1, GEL: 2.7, … }
});

export type User         = typeof user.$inferSelect;
export type Session      = typeof session.$inferSelect;
export type ExchangeRates = typeof exchangeRates.$inferSelect;
