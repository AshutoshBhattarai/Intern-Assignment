export interface UserSummary {
  id?: string;
  username?: string;
  email?: string;
  totalIncome?: number;
  totalExpense?: number;
  totalCategory?: number;
  totalBudget?: number;
  countExpense?: number;
  totalExpenseByCategory?: {
    category: string;
    total: number;
    count: number;
  }[];
  totalExpenseByDate?: {
    date: Date;
    total: number;
  }[];
}
