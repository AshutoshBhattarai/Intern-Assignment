import NotFoundError from "../errors/NotFound";
import WarningError from "../errors/Warning";
import Budget from "../models/Budget";
import Category from "../models/Category";
import Expense from "../models/Expense";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import { getCategory } from "../repositories/CategoryRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import { getUserById } from "../repositories/UserRepo";
import { ExpenseQuery } from "../types/QueryType";

//* -------------------- Function that adds a new expense -------------------- */

export const createExpense = async (user: User, expense: Expense) => {
  // Check if the user exists
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }

  // Get the category for the expense
  const category = await getCategory(expense.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const [budget]: Budget[] = await budgetRepo.getBudgetByCategory(
    user,
    category
  );

  if (!budget) {
    throw new NotFoundError("Budget for this category doesn't exist found");
  }
  if (budget.remainingAmount < expense.amount) {
    throw new WarningError("Amount Exceeds Your Remaining Budget");
  }
  const updateBudget = new Budget();
  updateBudget.id = budget.id;
  updateBudget.spentAmount = budget.spentAmount + expense.amount;
  updateBudget.remainingAmount = budget.amount - updateBudget.spentAmount;
  await budgetRepo.updateBudget(updateBudget);

  expense.user = user;

  // Create the expense
  expenseRepo.createExpense(expense);
};
//* ----------------------------------- -- ----------------------------------- */
//* ------- Service that returns all the expenses of a particular user ------ */
export const getAllExpenses = async (user: User) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const expenses = await expenseRepo.getExpenses(user);
  return expenses.map((expense) => expenseResponse(expense));
};
//* ----------------------------------- -- ----------------------------------- */
/* --------------------- Service that updates an expense -------------------- */
export const updateExpense = async (user: User, expense: Expense) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  expense.user = user;
  expenseRepo.updateExpense(expense);
};
//* ----------------------------------- -- ----------------------------------- */
//* -------------- Service filteres expenses by query parameters ------------- */
export const getFilteredExpenses = async (user: User, params: ExpenseQuery) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  // const expenses = await expenseRepo.getFilteredExpenses(user, params);
  const expenses = await expenseRepo.getExpenseWithCategory(user, params);
  return expenses.map((expense) => expenseResponse(expense));
};
/* ----------------------------------- -- ----------------------------------- */
export const deleteExpense = async (user: User, id: string) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const expense = await expenseRepo.getExpensesById(id);
  if (!expense) throw new NotFoundError("Expense not found");
  expenseRepo.deleteExpense(expense.id);
};
/* --------------------------------- Extras --------------------------------- */
// This function takes the expense object and returns a new expense object suitable for response.
const expenseResponse = (expense: Expense) => {
  const resExpense = new Expense();
  resExpense.id = expense.id;
  resExpense.amount = expense.amount;
  resExpense.date = expense.date;
  resExpense.description = expense.description;
  resExpense.image = `http://localhost:5000/images/${expense.user}/${
    expense.image || "no-image"
  }`;
  const category = new Category();
  category.id = expense.category.id;
  category.title = expense.category.title;
  resExpense.category = category;
  return resExpense;
};
