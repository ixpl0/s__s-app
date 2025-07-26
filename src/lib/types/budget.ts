import type {
  BalanceSource,
  IncomeEntry,
  ExpenseEntry,
} from '$lib/types/balance';

export interface MonthData {
  month: number;
  year: number;
  startBalance: number;
  balanceChange: number;
  pocketExpenses: number;
  income: number;
  expenses: number;
  userMonthId: string;
}

export interface MonthDataWithDetails extends MonthData {
  balanceSources: BalanceSource[];
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
}
