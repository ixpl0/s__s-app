import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUserMonth, getUserMonth } from '$lib/server/db/budget';
import { validateSessionToken, sessionCookieName } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { year, month } = await request.json();

    if (year === undefined || month === undefined) {
      return json({ error: 'Year and month are required' }, { status: 400 });
    }

    const existingMonth = await getUserMonth(user.id, year, month);

    if (existingMonth) {
      return json({ userMonth: existingMonth });
    }

    const [userMonth] = await createUserMonth({
      userId: user.id,
      year,
      month,
    });

    return json({ userMonth });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
