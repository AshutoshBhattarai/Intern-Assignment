import ForbiddenError from "../errors/Forbidden";
import NotFoundError from "../errors/NotFound";
import UnauthorizedError from "../errors/Unauthorized";
import Budget from "../models/Budget";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import * as userRepo from "../repositories/UserRepo";

export const createBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id))) {
    throw new NotFoundError("User not found");
  }
  const category = await categoryRepo.getCategory(budget.category as any);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  console.log(budget);
  const budgetsExists: Budget[] = await budgetRepo.getBudgetByCategory(
    user,
    category
  );
  // if (budgetsExists.length <= 0) {
  //   return;
  // }
  if (
    budgetsExists.length > 0 &&
    budgetsExists.some(
      (b) => b.startTime === budget.startTime && b.endTime === budget.endTime
    )
  ) {
    throw new ForbiddenError("Budget already exists");
  }
  budget.user = user;
  budget.remainingAmount = budget.amount;
  const newBudget = await budgetRepo.createBudget(budget);
  return newBudget;
};

export const getAllBudgets = async (user: User) => {
  const budgets = await budgetRepo.getBudget(user);
  return budgets.map((budget) => budgetResponse(budget));
};
//Todo
export const getBudgetById = async (user: User, id: string) => {
  const budget = await budgetRepo.getBudgetById(user, id);
  if (!budget) throw new NotFoundError("Budget not found");
  return budgetResponse(budget);
};

//Todo
export const getBudgetByTime = async (startTime: Date, endTime: Date) => {};

export const updateBudget = async (user: User, budget: Budget) => {
  if (!(await userRepo.getUserById(user.id)))
    throw new NotFoundError("User not found");
  const foundBudget = await budgetRepo.getBudgetById(user, budget.id);
  if (!foundBudget) throw new NotFoundError("Budget not found");
  if (foundBudget.user != user) {
    throw new UnauthorizedError("Unauthorized to update budget");
  }
  await budgetRepo.updateBudget(budget);
};

export const deleteBudget = async (user: User, id: string) => {
  if (!(await userRepo.getUserById(user.id)))
    throw new NotFoundError("User not found");
  await budgetRepo.deleteBudget(id);
};

const budgetResponse = (budget: Budget) => {
  const responseBudget = new Budget();
  responseBudget.id = budget.id;
  responseBudget.amount = budget.amount;
  responseBudget.category = budget.category;
  responseBudget.startTime = budget.startTime;
  responseBudget.endTime = budget.endTime;
  responseBudget.title = budget.title;
  responseBudget.user = budget.user;
  responseBudget.spentAmount = budget.spentAmount;
  responseBudget.remainingAmount = budget.remainingAmount;
  return responseBudget;
};
