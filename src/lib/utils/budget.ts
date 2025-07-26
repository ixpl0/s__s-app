export function getBalanceChangeClass(change: number): string {
  if (change > 0) {
    return 'text-success';
  }

  if (change < 0) {
    return 'text-error';
  }

  return '';
}

export function getPocketExpensesClass(
  expenses: number,
  income: number,
): string {
  const percentage = (expenses / income) * 100;

  if (percentage < 7) {
    return 'text-success';
  }

  if (percentage < 14) {
    return 'text-warning';
  }

  return 'text-error';
}

export function toUsd(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}
