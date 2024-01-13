interface Query {
  page?: number;
  id ?: string;
}
export interface BudgetQuery extends Query {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
}

export interface CategoryQuery extends Query {
  title?: string;
};

export interface IncomeQuery extends Query {
  source?: string;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
};

export interface ExpenseQuery extends Query {
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  category?: string;
}
