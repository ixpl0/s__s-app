export const monthNames = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(2000, i)),
);

export const BASE_CURRENCY = 'USD' as const;
