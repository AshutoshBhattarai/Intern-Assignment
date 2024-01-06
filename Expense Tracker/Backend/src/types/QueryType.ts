export type BudgetQuery = {
  id?: string;
  title?: string;
  date?: Date;
};

export type CategoryQuery = {
  id?: string;
  title?: string;
};

export type IncomeQuery = {
  id?: number;
  source?: string;
  amount?: number;
};

export type ExpenseQuery = {
  id?: string;
  amount?: number;
  date?: Date;
  description?: string;
};
