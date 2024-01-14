import { Between, FindOptionsWhere, ILike, Repository } from "typeorm";
import { DEFAULT_PAGE_SIZE } from "../constants";
import database from "../database/config";
import { ExpenseQuery } from "../interface/QueryInterface";
import Expense from "../models/Expense";
import User from "../models/User";

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
  return await repo.countBy({ user: { id } });
};

export const getFilteredExpenses = (user: User, params: ExpenseQuery) => {
  const whereConditions: FindOptionsWhere<Expense> = getQueryWhereConditions(
    user,
    params
  );
  return repo.find({ where: whereConditions });
};

export const getExpenseWithCategory = async (
  user: User,
  params: ExpenseQuery
) => {
  const page = params.page || 1;
  const whereConditions: FindOptionsWhere<Expense> = getQueryWhereConditions(
    user,
    params
  );
  return await repo
    .createQueryBuilder("expense")
    .select([
      "expense.id",
      "expense.amount",
      "expense.date",
      "expense.description",
      "expense.image",
    ])
    .where(whereConditions)
    .skip(DEFAULT_PAGE_SIZE * (page - 1))
    .take(DEFAULT_PAGE_SIZE)
    .leftJoinAndSelect("expense.category", "category")
    .orderBy("expense.date", "DESC")
    .getMany();
};

export const getUserTotalExpenseByCategory = (user: User) => {
  return repo
    .createQueryBuilder("expense")
    .select("sum(expense.amount) as total")
    .addSelect("category.title as category")
    .groupBy("expense.category_id")
    .addGroupBy("category.title")
    .where({ user: { id: user.id } })
    .where(
      `EXTRACT(YEAR FROM expense.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM expense.date) = EXTRACT(MONTH FROM CURRENT_DATE)`
    )
    .leftJoin("expense.category", "category")
    .getRawMany();
};

export const getUserTotalExpenseByDate = async (user: User) => {
  const currentDate = new Date();
  return await repo
    .createQueryBuilder("expense")
    .select("sum(expense.amount) as total")
    .addSelect("DATE(expense.date) as date")
    .addSelect("COUNT(expense.id) as count")
    .groupBy("DATE(expense.date)")
    .where({ user: { id: user.id } })
    .where(
      `EXTRACT(YEAR FROM expense.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM expense.date) = EXTRACT(MONTH FROM CURRENT_DATE)`
    )
    .getRawMany();
};

export const getUserTotalExpenseCount = async (
  user: User,
  params: ExpenseQuery
) => {
  const whereConditions: FindOptionsWhere<Expense> = getQueryWhereConditions(
    user,
    params
  );
  return await repo.countBy(whereConditions);
};

const getQueryWhereConditions = (user: User, params: ExpenseQuery) => {
  const whereConditions: FindOptionsWhere<Expense> = { user: { id: user.id } };
  if (params.id) whereConditions.id = params.id;
  if (params.amount)
    whereConditions.amount = Between(
      params.amount < 10000 ? 0 : params.amount / 2,
      params.amount
    );
  if (params.startDate && params.endDate)
    whereConditions.date = Between(params.startDate, params.endDate);
  if (params.description)
    whereConditions.description = ILike(`%${params.description}%`);
  if (params.category) whereConditions.category = { id: params.category };
  return whereConditions;
};
