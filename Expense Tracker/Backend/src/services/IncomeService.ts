import NotFoundError from "../errors/NotFound";
import Income from "../models/Income";
import User from "../models/User";
import * as incomeRepo from "../repositories/IncomeRepo";
import { getUserById } from "../repositories/UserRepo";

export const createIncome = async (user: User, income: Income) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  income.user = user;
  return incomeRepo.createIncome(income);
};

export const getUserIncome = async (user: User) => {
  if (!(await getUserById(user.id)))
    throw new NotFoundError(`User with not found`);
  return incomeRepo.getIncome(user);
};

