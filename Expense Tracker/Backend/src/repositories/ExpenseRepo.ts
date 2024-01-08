import { Between, FindOptionsWhere, ILike, Raw, Repository } from "typeorm";
import database from "../database/config";
import Expense from "../models/Expense";
import User from "../models/User";
import { ExpenseQuery } from "../types/QueryType";
import Category from "../models/Category";
import date from "date-fns";

const repo: Repository<Expense> = database.getRepository("expenses");

export const createExpense = async (expense: Expense) => {
  return await repo.save(expense);
};

export const updateExpense = async (expense: Expense) => {
  return await repo.update({ id: expense.id }, expense);
};

export const deleteExpense = async (id: string) => {
  return await repo.delete({ id });
};

export const getExpenses = async (user: User) => {
  return await repo.find({
    where: { user: { id: user.id } },
  });
};

export const getExpensesById = async (id: string) => {
  return await repo.findOneBy({ id });
};
export const getUserTotalExpense = async (id: string) => {
  return await repo.sum("amount", { user: { id: id } });
};
export const getUserExpenseCount = async (id: string) => {
  return await repo.findAndCountBy({ user: { id } });
};
// Todo Fix the code
//! Date range is not working
export const getTotalExpenseByDate = async (
  startDate: Date,
  endDate: Date,
  user: User,
  category: Category
) => {
  const firstDate = date.format(startDate, "yyyy-MM-dd");
  const lastDate = date.format(endDate, "yyyy-MM-dd");
  const test = await repo.find({
    where: {
      // user: { id: user.id },
      date: Between(lastDate as any, firstDate as any),
      // category: { id: category.id },
    },
  });
  console.log(test);
  // return repo.sum("amount", {
  //   user: { id: user.id },
  //   date: Between(startDate, endDate),
  //   category: { id: category.id },
  // });
  return 0;
};

export const getFilteredExpenses = (user: User, params: ExpenseQuery) => {
  const whereConditions: FindOptionsWhere<Expense> = { user: { id: user.id } };
  if (params.id) whereConditions.id = params.id;
  if (params.amount) whereConditions.amount = params.amount;
  if (params.date) whereConditions.date = params.date;
  if (params.description)
    whereConditions.description = ILike(`%${params.description}%`);
  if (params.category) whereConditions.category = { id: params.category };
  return repo.find({ where: whereConditions });
};
