import { Request, Response, NextFunction } from "express";
import * as expenseService from "../services/ExpenseService";
import HttpStatus from "http-status-codes";
import NotFoundError from "../errors/NotFound";
import Expense from "../models/Expense";
import User from "../models/User";

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    if (!user) throw new NotFoundError("User not found");
    const data = await expenseService.getAllExpenses(user);
    res.status(HttpStatus.OK).json({
      message: "Expenses were successfully retrieved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const expense: Expense = req.body;
    await expenseService.createExpense(user, expense);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Expense Added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const params = req.query;
    const data = await expenseService.getFilteredExpenses(user, params);
    res.status(HttpStatus.OK).json({
      message: "Expenses were successfully retrieved",
      data,
    });
  } catch (error) {
    next(error);
  }
};
