import { NextFunction, Request, Response } from "express";
import * as budgetService from "../services/BudgetService";
import HttpStatus from "http-status-codes";

export const createBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budget = req.body;
    const user = res.locals.user;
    const response = await budgetService.createBudget(user, budget);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Budget created successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const budgets = await budgetService.getAllBudgets(user);
    res.status(HttpStatus.OK).json({
      message: "Budgets fetched successfully",
      result: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const budget = budgetService.getBudgetById(user, req.params.id);
    res.status(HttpStatus.OK).json({
      message: "Budget fetched successfully",
      result: budget,
    });
  } catch (error) {
    next(error);
  }
};
