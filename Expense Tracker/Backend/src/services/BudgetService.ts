import NotFoundError from "../errors/NotFound";
import Budget from "../models/Budget";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import * as userRepo from "../repositories/UserRepo";

export const createBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id)))
    throw new NotFoundError("User not found");
  if (!await categoryRepo.getCategory(budget.category as any))
    throw new NotFoundError("Category not found");
  budget.user = user;
  const newBudget = await budgetRepo.createBudget(budget);
  return newBudget;
};

export const getAllBudgets = async (user: User) => {
  const budgets = await budgetRepo.getBudget(user);
  return budgets;
};

export const getBudgetById = async (user: User, id: string) => {};

export const getBudgetByTime = async (startTime: Date, endTime: Date) => {};

export const updateBudget = async (id: string, budget: Budget) => {};

export const deleteBudget = async (id: string) => {};
