import { Repository } from "typeorm";
import Budget from "../models/Budget";
import database from "../database/config";
import User from "../models/User";

const repo: Repository<Budget> = database.getRepository("budgets");

export const getBudget = async (user: User) => {
  return await repo.find({
    where: { user },
  });
};

export const createBudget = async (budget: Budget) => {
  return await repo.save(budget);
};

export const deleteBudget = async (id: string) => {
  return await repo.delete({ id });
};
export const updateBudget = async (id: string, budget: Budget) => {
  return await repo.update({ id }, budget);
};
