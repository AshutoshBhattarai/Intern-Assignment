import NotFoundError from "../errors/NotFound";
import Expense from "../models/Expense";
import User from "../models/User";
import { getCategory } from "../repositories/CategoryRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import { getUserById } from "../repositories/UserRepo";
import { ExpenseQuery } from "../types/QueryType";
import * as budgetRepo from "../repositories/BudgetRepo";
import WarningError from "../errors/Warning";

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

  // Get the total budget for the category
  const totalBudget =
    (await budgetRepo.getCategoryTotalBudget(user, category)) || 0;

  // Get the start and end dates of the current month
  const date = new Date();
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Get the total expense for the current month
  //! Currently Doesn't Work (Total Expense is just 0 for now)
  const totalExpense =
    (await expenseRepo.getTotalExpenseByDate(
      startDate,
      endDate,
      user,
      category
    )) || 0;
  console.log(totalExpense);

  // Calculate the remaining budget
  const remainingBudget = totalBudget - totalExpense;

  // Check if the remaining budget is enough to cover the expense amount
  if (remainingBudget < expense.amount) {
    throw new WarningError("Amount Exceeds Your Budget");
  }

  // Set the user for the expense
  expense.user = user;

  // Create the expense
  expenseRepo.createExpense(expense);
};
//* ----------------------------------- -- ----------------------------------- */
//* ------- Service that returns all the expenses of a particular user ------ */
export const getAllExpenses = async (user: User) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  const expenses = await expenseRepo.getExpenses(user);
  return expenses.map((expense) => expenseResponse(expense));
};
//* ----------------------------------- -- ----------------------------------- */
/* --------------------- Service that updates an expense -------------------- */
export const updateExpense = async (user: User, expense: Expense) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  expense.user = user;
  expenseRepo.updateExpense(expense);
};
//* ----------------------------------- -- ----------------------------------- */
//* -------------- Service filteres expenses by query parameters ------------- */
export const getFilteredExpenses = async (user: User, params: ExpenseQuery) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  const expenses = await expenseRepo.getFilteredExpenses(user, params);
  return expenses.map((expense) => expenseResponse(expense));
};
/* ----------------------------------- -- ----------------------------------- */

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
  return resExpense;
};
