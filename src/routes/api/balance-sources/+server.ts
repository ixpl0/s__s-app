import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getBalanceSourcesByUserMonth,
  createBalanceSource,
  updateBalanceSource,
  deleteBalanceSource,
} from '$lib/server/db/budget';
import { validateSessionToken, sessionCookieName } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userMonthId = url.searchParams.get('userMonthId');

  if (!userMonthId) {
    return json({ error: 'userMonthId is required' }, { status: 400 });
  }

  try {
    const balanceSources = await getBalanceSourcesByUserMonth(userMonthId);

    return json({ balanceSources });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

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
    const { userMonthId, name, currency, amount } = await request.json();

    if (!userMonthId || !name || !currency || amount === undefined) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [balanceSource] = await createBalanceSource({
      userMonthId,
      name,
      currency,
      amount,
    });

    return json({ balanceSource });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, currency, amount } = await request.json();

    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    const [balanceSource] = await updateBalanceSource(id, {
      name,
      currency,
      amount,
    });

    return json({ balanceSource });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
  const sessionToken = cookies.get(sessionCookieName);

  if (!sessionToken) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user } = await validateSessionToken(sessionToken);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = url.searchParams.get('id');

  if (!id) {
    return json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await deleteBalanceSource(id);

    return json({ success: true });
  } catch {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
