import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getOrCreateUserSettings,
  updateUserSettings,
} from '$lib/server/services/user-settings';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  baseCurrency: z.enum(['USD', 'RUB', 'GEL', 'TRY', 'THB', 'INR']),
});

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getOrCreateUserSettings(locals.user.id);
    return json({ success: true, data: { settings } });
  } catch (error) {
    console.error('Error loading user settings:', error);
    return json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { baseCurrency } = updateSettingsSchema.parse(body);

    const updatedSettings = await updateUserSettings(
      locals.user.id,
      baseCurrency,
    );
    return json({ success: true, data: { settings: updatedSettings } });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
