import { Repository } from "typeorm";
import Expense from "../models/Expense";
import database from "../database/config";
import User from "../models/User";

const repo: Repository<Expense> = database.getRepository("expenses");

export const createExpense = async (expense: Expense) => {
  return await repo.save(expense);
};

export const updateExpense = async (expense: Expense) => {
  return await repo.update({ id: expense.id }, expense);
};

export const deleteExpense = async (expense: Expense) => {
  return await repo.delete({ id: expense.id });
};

export const getExpenses = async (user: User) => {
  return await repo.find({
    where: { user: { id: user.id } },
  });
};

export const getExpensesById = async (id: string) => {
  return await repo.findOneBy({ id });
};

export const getExpenseByDate = (
  startDate: Date,
  endDate: Date,
  user: User
) => {
  //Todo Add the return Logic
};
