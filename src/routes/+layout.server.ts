import type { LayoutServerLoad } from './$types';
import { getOrCreateUserSettings } from '$lib/server/services/user-settings';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      user: null,
      userSettings: null,
    };
  }

  try {
    const userSettings = await getOrCreateUserSettings(locals.user.id);

    return {
      user: locals.user,
      userSettings: {
        baseCurrency: userSettings.baseCurrency,
      },
    };
  } catch (error) {
    console.error('Error loading user settings:', error);

    return {
      user: locals.user,
      userSettings: {
        baseCurrency: 'USD',
      },
    };
  }
};
