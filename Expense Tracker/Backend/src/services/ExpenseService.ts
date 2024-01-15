import NotFoundError from "../errors/NotFound";
import Budget from "../models/Budget";
import Category from "../models/Category";
import Expense from "../models/Expense";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import { getCategory } from "../repositories/CategoryRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import { getUserById } from "../repositories/UserRepo";
import { ExpenseQuery } from "../interface/QueryInterface";

//* -------------------- Function that adds a new expense -------------------- */

export const createExpense = async (user: User, expense: Expense) => {
  
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }

  const category = await getCategory(expense.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  // Update the budget with the new expense
  await updateBudget(user, category, expense, "add");
  

  expense.user = user;

  await expenseRepo.createExpense(expense);
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
//* --------------------- Service that updates an expense -------------------- */
export const updateExpense = async (user: User, expense: Expense) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const expenseExists = await expenseRepo.getExpensesById(expense.id);
  if (!expenseExists) {
    throw new NotFoundError("Expense not found");
  }
  const category = await getCategory(expense.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  // Update the budget first delete the old expense and add the new one
  await updateBudget(user, category, expenseExists, "remove");
  await updateBudget(user, category, expense, "add");
  expense.createdAt = expenseExists.createdAt;
  expense.user = user;
  await expenseRepo.updateExpense(expense);
};
//* ----------------------------------- -- ----------------------------------- */
//* -------------- Service filteres expenses by query parameters ------------- */
export const getFilteredExpenses = async (user: User, params: ExpenseQuery) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const expenses = await expenseRepo.getExpenseWithCategory(user, params);
  return expenses.map((expense) => expenseResponse(expense));
};
/* ----------------------------------- -- ----------------------------------- */
//* ------------------ Service that deletes an expense ---------------------- */
export const deleteExpense = async (user: User, id: string) => {
  if (!(await getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const expense = await expenseRepo.getExpensesById(id);
  if (!expense) {
    throw new NotFoundError("Expense not found");
  }
  const category = await getCategory(expense.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  await updateBudget(user, category, expense, "remove");
  await expenseRepo.deleteExpense(expense.id);
};
/* --------------------------------- Extras --------------------------------- */
const expenseResponse = (expense: Expense) => {
  const resExpense = new Expense();
  resExpense.id = expense.id;
  resExpense.amount = expense.amount;
  resExpense.date = expense.date;
  resExpense.description = expense.description;
  resExpense.image = `http://localhost:5000/images/${expense.category.user}/${
    expense.image || "noimage"
  }`;
  const category = new Category();
  category.id = expense.category.id;
  category.title = expense.category.title;
  resExpense.category = category;
  return resExpense;
};

// Updates the budget by adding or removing the expense.
const updateBudget = async (
  user: User,
  category: Category,
  expense: Expense,
  task: "add" | "remove"
) => {
  const budgets: Budget[] = await budgetRepo.getBudgetByCategory(
    user,
    category
  );
  if (budgets) {
    if (task === "add") {
      await budgets.forEach(async (budget) => {
        // check if the expense is within the budget time frame
        if (
          !(expense.createdAt < budget.createdAt || expense.createdAt
            ? expense.createdAt
            : new Date() > budget.endTime)
        ) {
          // update the budget's spent amount
          const newSpentAmount =
            parseFloat(budget.spentAmount.toString()) +
            parseFloat(expense.amount.toString());
          budget.spentAmount = newSpentAmount;
          budget.remainingAmount = budget.amount - newSpentAmount;
          if (budget.remainingAmount <= 0) {
            budget.remainingAmount = 0;
          }
          await budgetRepo.updateBudget(budget);
        }
      });
    } else if (task === "remove") {
      await budgets.forEach(async (budget) => {
        if (
          !(
            expense.createdAt < budget.createdAt ||
            expense.createdAt > budget.endTime
          )
        ) {
          const newSpentAmount =
            parseFloat(budget.spentAmount.toString()) -
            parseFloat(expense.amount.toString());
          budget.spentAmount = newSpentAmount;
          budget.remainingAmount = budget.amount - newSpentAmount;
          if (budget.remainingAmount >= budget.amount) {
            budget.remainingAmount = budget.amount;
          }
          if (budget.spentAmount <= 0) {
            budget.spentAmount = 0;
          }
          await budgetRepo.updateBudget(budget);
        }
      });
    }
  }
};
