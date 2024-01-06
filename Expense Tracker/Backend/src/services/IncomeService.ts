import NotFoundError from "../errors/NotFound";
import ValidationError from "../errors/Validation";
import Income from "../models/Income";
import User from "../models/User";
import * as incomeRepo from "../repositories/IncomeRepo";
import { getUserById } from "../repositories/UserRepo";

export const createIncome = async (user: User, income: Income) => {
  if (!(await getUserById(user.id))) throw new NotFoundError("User not found");
  income.user = user;
  if (income.source.toLowerCase() == "salary") {
    const currentSalary = await incomeRepo.getIncomeSource(user);
    const currentDate = new Date();
    if (currentSalary) {
      if (
        currentDate.getMonth() == currentSalary.createdAt.getMonth() &&
        currentDate.getFullYear() == currentSalary.createdAt.getFullYear()
      ) {
        throw new ValidationError("Salary already added for this month");
      } else {
        currentSalary.active = false;
        await incomeRepo.updateIncome(currentSalary);
      }
    }
  }

  return incomeRepo.createIncome(income);
};

export const getUserIncome = async (user: User) => {
  if (!(await getUserById(user.id)))
    throw new NotFoundError(`User with not found`);
  return incomeRepo.getIncome(user);
};
