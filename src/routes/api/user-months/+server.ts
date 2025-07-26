import type { RequestHandler } from './$types';
import { userMonthSchema, createApiResponse } from '$lib/types/api';
import { createServerError, ValidationError } from '$lib/utils/error-handling';
import { createUserMonth } from '$lib/server/db/budget';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals.user) {
      throw new ValidationError('Необходима авторизация');
    }

    const rawBody = await request.json();
    const { year, month } = userMonthSchema.parse(rawBody);

    const userMonth = await createUserMonth({
      userId: locals.user.id,
      year,
      month,
    });

    return new Response(JSON.stringify(createApiResponse({ userMonth })), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const { status, body } = createServerError(error);
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
