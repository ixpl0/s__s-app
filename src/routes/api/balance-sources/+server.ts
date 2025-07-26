import type { RequestHandler } from './$types';
import { balanceSourceSchema, createApiResponse } from '$lib/types/api';
import { createServerError, ValidationError } from '$lib/utils/error-handling';
import {
  getBalanceSourcesByUserMonth,
  saveBalanceSourcesForUserMonth,
} from '$lib/server/db/budget';
import { z } from 'zod';

const requestBodySchema = z.object({
  userMonthId: z.string().uuid(),
  balanceSources: z.array(balanceSourceSchema),
});

export const GET: RequestHandler = async ({ url }) => {
  try {
    const userMonthId = url.searchParams.get('userMonthId');

    if (!userMonthId) {
      throw new ValidationError('userMonthId is required');
    }

    const balanceSources = await getBalanceSourcesByUserMonth(userMonthId);

    return new Response(JSON.stringify(createApiResponse(balanceSources)), {
      status: 200,
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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const rawBody = await request.json();

    const { userMonthId, balanceSources } = requestBodySchema.parse(rawBody);

    const savedSources = await saveBalanceSourcesForUserMonth(
      userMonthId,
      balanceSources,
    );

    return new Response(
      JSON.stringify(createApiResponse({ balanceSources: savedSources })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    const { status, body } = createServerError(error);
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
