import NotFoundError from "../errors/NotFound";
import WarningError from "../errors/Warning";
import Budget from "../models/Budget";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import { totalIncome } from "../repositories/IncomeRepo";
import * as userRepo from "../repositories/UserRepo";

export const createBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id)))
    throw new NotFoundError("User not found");
  if (!(await categoryRepo.getCategory(budget.category as any)))
    throw new NotFoundError("Category not found");
  budget.user = user;

  const availableBudget = (await totalIncome(user)) || 0;
  const allocatedBudget = (await budgetRepo.getTotalBudget(user)) || 0;
  if (availableBudget < budget.amount + allocatedBudget)
    throw new WarningError("Amount Exceeds Your Total Budget");
  const newBudget = await budgetRepo.createBudget(budget);
  return newBudget;
};

export const getAllBudgets = async (user: User) => {
  const budgets = await budgetRepo.getBudget(user);
  return budgets.map((budget) => budgetResponse(budget));
};

export const getBudgetById = async (user: User, id: string) => {};

export const getBudgetByTime = async (startTime: Date, endTime: Date) => {};

export const updateBudget = async (id: string, budget: Budget) => {};

export const deleteBudget = async (id: string) => {};

const budgetResponse = (budget: Budget) => {
  const responseBudget = new Budget();
  responseBudget.id = budget.id;
  responseBudget.amount = budget.amount;
  responseBudget.category = budget.category;
  responseBudget.startTime = budget.startTime;
  responseBudget.endTime = budget.endTime;
  responseBudget.title = budget.title;
  return responseBudget;
};
