import type {
  BalanceSource,
  IncomeEntry,
  ExpenseEntry,
} from '$lib/types/balance';

export interface MonthData {
  month: number;
  year: number;
  balanceSources: BalanceSource[];
  balanceChange: number;
  pocketExpenses: number;
  income: number;
  expenses: number;
  userMonthId: string;
}

export interface MonthDataWithDetails extends MonthData {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
}
