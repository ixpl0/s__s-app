import type { RequestHandler } from './$types';
import { createApiResponse } from '$lib/types/api';
import { createServerError, ValidationError } from '$lib/utils/error-handling';
import { deleteBalanceSource } from '$lib/server/db/budget';

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      throw new ValidationError('ID источника баланса обязателен');
    }

    await deleteBalanceSource(id);

    return new Response(JSON.stringify(createApiResponse({ success: true })), {
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
