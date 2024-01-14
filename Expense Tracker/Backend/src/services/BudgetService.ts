import ForbiddenError from "../errors/Forbidden";
import NotFoundError from "../errors/NotFound";
import { BudgetQuery } from "../interface/QueryInterface";
import Budget from "../models/Budget";
import Category from "../models/Category";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import * as userRepo from "../repositories/UserRepo";
import { isSameDate } from "../utils/utils";

export const createBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const category = await categoryRepo.getCategory(budget.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  const budgetsExists: Budget[] = await budgetRepo.getBudgetByCategory(
    user,
    category
  );
  checkBudgetExists(budgetsExists, budget);

  budget.category = category;
  budget.user = user;
  budget.remainingAmount = budget.amount;
  const newBudget = await budgetRepo.createBudget(budget);
  return newBudget;
};

export const getAllBudgets = async (user: User) => {
  const budgets = await budgetRepo.getBudget(user);
  return budgets.map((budget) => budgetResponse(budget));
};
export const getBudgetById = async (user: User, id: string) => {
  const budget = await budgetRepo.getBudgetById(user, id);
  if (!budget) {
    throw new NotFoundError("Budget not found");
  }
  return budgetResponse(budget);
};

export const updateBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const foundBudget = await budgetRepo.getBudgetById(user, budget.id);
  if (!foundBudget) {
    throw new NotFoundError("Budget not found");
  }
  const category = await categoryRepo.getCategory(budget.category as any);
  if (foundBudget.user != (user.id as any)) {
    throw new ForbiddenError("Unauthorized to update budget");
  }
  const budgetsExists: Budget[] = await budgetRepo.getBudgetByCategory(
    user,
    category!
  );
  checkBudgetExists(budgetsExists, budget);
  budget.remainingAmount = budget.amount - foundBudget.spentAmount;
  await budgetRepo.updateBudget(budget);
};

export const deleteBudget = async (user: User, id: string) => {
  if (!(await userRepo.getUserById(user.id)))
    throw new NotFoundError("User not found");
  await budgetRepo.deleteBudget(id);
};

export const getFilteredBudget = (user: User, params: BudgetQuery) => {
  return budgetRepo.getFilteredBudget(user, params);
};

const budgetResponse = (budget: Budget) => {
  const responseBudget = new Budget();
  responseBudget.id = budget.id;
  responseBudget.amount = budget.amount;
  responseBudget.startTime = budget.startTime;
  responseBudget.endTime = budget.endTime;
  responseBudget.title = budget.title;
  responseBudget.user = budget.user;
  responseBudget.spentAmount = budget.spentAmount;
  responseBudget.remainingAmount = budget.remainingAmount;
  const category = new Category();
  category.id = budget.category.id;
  category.title = budget.category.title;
  responseBudget.category = category;
  return responseBudget;
};

const checkBudgetExists = (existingBudget: Budget[], budget: Budget) => {
  existingBudget.map((b: Budget) => {
    if (
      isSameDate(b.startTime, budget.startTime) &&
      isSameDate(b.endTime, budget.endTime) &&
      b.id !== budget.id
    ) {
      throw new ForbiddenError("Budget already exists");
    }
  });
};
