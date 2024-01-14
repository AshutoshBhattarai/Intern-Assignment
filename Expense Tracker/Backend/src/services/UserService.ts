import NotFoundError from "../errors/NotFound";
import User from "../models/User";
import * as userRepo from "../repositories/UserRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as incomeRepo from "../repositories/IncomeRepo";
import { UserSummary } from "../interface/UserSummary";

export const getAllUsers = async (): Promise<User[]> => {
  const users = await userRepo.getAllUsers();
  return users.map((user) => filterUser(user));
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError(`User with id : ${id} not found`);
  return filterUser(user);
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new NotFoundError(`User with email : ${email} not found`);
  return filterUser(user);
};

export const deleteUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  await userRepo.deleteUser(user);
};

export const updateUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
};
export const getUserSummary = async (user: User) => {
  const foundUser = await userRepo.getUserById(user.id);
  if (!foundUser) throw new NotFoundError("User not found");
  const totalIncome = await incomeRepo.getUserTotalIncome(foundUser.id);
  const totalExpense = await expenseRepo.getUserTotalExpense(foundUser.id);
  const totalBudget = await budgetRepo.getUserTotalBudget(foundUser.id);
  const expenseCount = await expenseRepo.getUserExpenseCount(foundUser.id);
  const expenseByCategory = await expenseRepo.getUserTotalExpenseByCategory(
    user
  );
  const expenseByDate = await expenseRepo.getUserTotalExpenseByDate(user);

  const summary: UserSummary = {};
  summary.id = foundUser.id;
  summary.email = foundUser.email;
  summary.username = foundUser.username;
  summary.totalIncome = totalIncome || 0;
  summary.totalExpense = totalExpense || 0;
  summary.totalBudget = totalBudget || 0;
  summary.totalExpenseByCategory = expenseByCategory || [];
  summary.totalExpenseByDate = expenseByDate || [];
  summary.countExpense = expenseCount;

  return summary;
};

const filterUser = (user: User) => {
  const userInfo = new User();
  userInfo.id = user.id;
  userInfo.email = user.email;
  userInfo.username = user.username;
  userInfo.createdAt = user.createdAt;
  userInfo.updatedAt = user.updatedAt;
  return userInfo;
};
