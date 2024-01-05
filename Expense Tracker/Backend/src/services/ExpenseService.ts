import NotFoundError from "../errors/NotFound";
import Expense from "../models/Expense";
import User from "../models/User";
import * as expenseRepo from "../repositories/ExpenseRepo";
import { getUserById } from "../repositories/UserRepo";

export const createExpense = async (user: User, expense: Expense) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  expense.user = user;
  expenseRepo.createExpense(expense);
};

export const getAllExpenses = async (user: User) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  return expenseRepo.getExpenses(user);
};

export const updateExpense = async (user: User, expense: Expense) =>{
    
}