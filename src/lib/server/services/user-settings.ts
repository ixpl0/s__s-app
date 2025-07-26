import { db } from '$lib/server/db';
import { userSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { CurrencyValue } from '$lib/types/balance';
import type { UserSettings } from '$lib/server/db/schema';

export async function getUserSettings(
  userId: string,
): Promise<UserSettings | null> {
  const settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  return settings[0] || null;
}

export async function createDefaultUserSettings(
  userId: string,
): Promise<UserSettings> {
  const now = new Date();
  const id = crypto.randomUUID();

  const [newSettings] = await db
    .insert(userSettings)
    .values({
      id,
      userId,
      baseCurrency: 'USD',
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newSettings;
}

export async function updateUserSettings(
  userId: string,
  baseCurrency: CurrencyValue,
): Promise<UserSettings> {
  const now = new Date();

  const [updatedSettings] = await db
    .update(userSettings)
    .set({
      baseCurrency,
      updatedAt: now,
    })
    .where(eq(userSettings.userId, userId))
    .returning();

  return updatedSettings;
}

export async function getOrCreateUserSettings(
  userId: string,
): Promise<UserSettings> {
  let settings = await getUserSettings(userId);

  if (!settings) {
    settings = await createDefaultUserSettings(userId);
  }

  return settings;
}
