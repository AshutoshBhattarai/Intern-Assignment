import { Between, FindOptionsWhere, ILike, Repository } from "typeorm";
import Income from "../models/Income";
import database from "../database/config";
import User from "../models/User";
import { IncomeQuery } from "../interface/QueryInterface";
import { DEFAULT_PAGE_SIZE } from "../constants";

const repo: Repository<Income> = database.getRepository("income");
export const getIncome = async (user: User) => {
  return await repo.find({
    where: { user: { id: user.id } },
    relations: { user: true },
  });
};

export const createIncome = async (income: Income) => {
  return await repo.save(income);
};

export const updateIncome = async (income: Income) => {
  return await repo.update({ id: income.id }, income);
};

export const deleteIncome = async (id: string) => {
  return await repo.delete({ id });
};
export const getUserTotalIncome = async (id: string) => {
  return await repo.sum("amount", { user: { id: id } });
};
export const getIncomeById = async (id: string) => {
  return await repo.findOneBy({ id });
};

export const totalIncome = async (user: User) => {
  return await repo.sum("amount", { user: { id: user.id } });
};

export const getIncomeSource = async (user: User) => {
  return await repo.findOne({
    where: { user: { id: user.id }, source: ILike("Salary") },
  });
};

export const getFilteredIncome = (user: User, params: IncomeQuery) => {
  const page = params.page || 1;
  return repo.find({
    where: getQueryWhereConditions(user, params),
    take: DEFAULT_PAGE_SIZE,
    skip: DEFAULT_PAGE_SIZE * (page - 1),
  });
};

export const getIncomeCount = (user: User, params: IncomeQuery) => {
  return repo.countBy(getQueryWhereConditions(user, params));
};

const getQueryWhereConditions = (
  user: User,
  params: IncomeQuery
): FindOptionsWhere<Income> => {
  const whereConditions: FindOptionsWhere<Income> = { user: { id: user.id } };
  if (params.id) whereConditions.id = params.id;
  if (params.amount) whereConditions.amount = params.amount;
  if (params.startDate && params.endDate)
    whereConditions.date = Between(params.startDate, params.endDate);
  if (params.source) whereConditions.source = ILike(`%${params.source}%`);
  return whereConditions;
};
