import BadRequestError from "../errors/BadRequest";
import NotFoundError from "../errors/NotFound";
import { UserSummary } from "../interface/UserSummary";
import User from "../models/User";
import * as budgetRepo from "../repositories/BudgetRepo";
import * as expenseRepo from "../repositories/ExpenseRepo";
import * as incomeRepo from "../repositories/IncomeRepo";
import * as userRepo from "../repositories/UserRepo";
import argon2 from "argon2";

// Get all users from the database(Not in use)
export const getAllUsers = async (): Promise<User[]> => {
  const users = await userRepo.getAllUsers();
  return users.map((user) => filterUser(user));
};
// Get a single user from the database with id
export const getUserById = async (id: string): Promise<User> => {
  const findUser = await userRepo.getUserById(id);
  if (!findUser) throw new NotFoundError(`User with id : ${id} not found`);
  return filterUser(findUser);
};

// Get a single user from the database with email
export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new NotFoundError(`User with email : ${email} not found`);
  return filterUser(user);
};

// Delete a user from the database(Not in use)
export const deleteUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  await userRepo.deleteUser(user);
};

// Update user's details
export const updateUser = async (user: User) => {
  const findUser = await userRepo.getUserById(user.id);
  if (!findUser) throw new NotFoundError("User not found");

  if (user.email) {
    const userExists = await userRepo.getUserByEmail(user.email);

    if (userExists && userExists.id !== user.id)
      throw new BadRequestError(`User with email ${user.email} already exists`);
  }

  if (user.password) {
    const hashedPassword = await argon2.hash(user.password);
    user.password = hashedPassword;
  }
  await userRepo.updateUser(user);
};

// Get user summary for the dashboard
// This returns user's details like name,total income,total expense etc.
export const getUserSummary = async (user: User) => {
  const foundUser = await userRepo.getUserById(user.id);
  if (!foundUser) throw new NotFoundError("User not found");
  const totalIncome = await incomeRepo.getUserTotalIncome(foundUser.id);
  const totalExpense = await expenseRepo.getUserTotalExpense(foundUser.id);
  const totalBudget = await budgetRepo.getUserTotalBudget(foundUser.id);
  // Get expense count and total expense by category within the current month
  const expenseCount = await expenseRepo.getUserExpenseCount(foundUser.id);
  const expenseByCategory = await expenseRepo.getUserTotalExpenseByCategory(
    user
  );
  // Get expense total expense by date within the current month
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
