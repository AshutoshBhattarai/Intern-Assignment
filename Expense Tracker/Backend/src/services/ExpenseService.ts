import NotFoundError from "../errors/NotFound";
import Expense from "../models/Expense";
import User from "../models/User";
import { getCategory } from "../repositories/CategoryRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import { getUserById } from "../repositories/UserRepo";
import { ExpenseQuery } from "../types/QueryType";
import * as budgetRepo from "../repositories/BudgetRepo";
import WarningError from "../errors/Warning";

export const createExpense = async (user: User, expense: Expense) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  const category = await getCategory(expense.category as any);
  if (!category) throw new NotFoundError("Category not found");
  const totalBudget =
    (await budgetRepo.getCategoryTotalBudget(user, category)) || 0;
  if (totalBudget < expense.amount) {
    throw new WarningError("Amount Exceeds Your Total Budget");
  }
  expense.user = user;
  expenseRepo.createExpense(expense);
};

export const getAllExpenses = async (user: User) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  return expenseRepo.getExpenses(user);
};

export const updateExpense = async (user: User, expense: Expense) => {};

export const getFilteredExpenses = async (
  user: User,
  params: ExpenseQuery
) => {};

const expenseResponse = (expense: Expense) => {
  const resExpense = new Expense();
  resExpense.id = expense.id;
  resExpense.amount = expense.amount;
  resExpense.date = expense.date;
  resExpense.description = expense.description;
  resExpense.image = `http://localhost:5000/images/${expense.user}/${expense.image || "no-image"}`;
  return resExpense;
};
