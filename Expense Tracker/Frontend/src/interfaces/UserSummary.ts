interface UserSummary {
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
  }[];
  totalExpenseByDate?: {
    date: Date;
    total: number;
    count: number;
  }[];
}

export default UserSummary;
