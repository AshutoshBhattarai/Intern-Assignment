import { LessThan, MoreThan, Repository } from "typeorm";
import Budget from "../models/Budget";
import database from "../database/config";
import User from "../models/User";
import Category from "../models/Category";

const repo: Repository<Budget> = database.getRepository("budgets");

export const getBudget = async (user: User) => {
  return await repo.find({
    where: { user: { id: user.id } },
    relations: ["user", "category"],
  });
};

export const getBudgetById = async (user: User, id: string) => {
  return await repo.findOne({ where: { id, user: { id: user.id } } });
};

export const createBudget = async (budget: Budget) => {
  return await repo.save(budget);
};
export const getUserTotalBudget = async (id: string) => {
  return await repo.sum("amount", { user: { id: id } });
};
export const deleteBudget = async (id: string) => {
  return await repo.delete({ id });
};
export const updateBudget = async (budget: Budget) => {
  return await repo.update({ id: budget.id }, budget);
};

export const getTotalBudget = async (user: User) => {
  return await repo.sum("amount", {
    user: { id: user.id },
  });
};

export const getCategoryTotalBudget = async (
  user: User,
  category: Category
) => {
  return await repo.sum("amount", {
    user: { id: user.id },
    category: { id: category.id },
  });
};

export const getBudgetByCategory = async (user: User, category: Category) => {
  return await repo.find({
    where: { user: { id: user.id }, category: { id: category.id } },
  });
};

export const getCategoryBudgetByDate = async (
  date: Date,
  user: User,
  category: Category
) => {
  return await repo.find({
    where: {
      user: { id: user.id },
      category: { id: category.id },
      startTime: MoreThan(date),
      endTime : LessThan(date),
    },
  });
};
