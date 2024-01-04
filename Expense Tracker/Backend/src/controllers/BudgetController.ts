import { NextFunction, Request, Response } from "express";
import * as budgetService from "../services/BudgetService";
import HttpStatus from "http-status-codes";
import User from "../models/User";
import { extractUserFromJwt } from "../utils/extractUser";

export const createBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budget = req.body;
    const user = extractUserFromJwt(req);
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
    const user = (new User().id = (req as any).user);
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
    const user = (new User().id = (req as any).user);
    const budget = budgetService.getBudgetById(user, req.params.id);
    res.status(HttpStatus.OK).json({
      message: "Budget fetched successfully",
      result: budget,
    });
  } catch (error) {
    next(error);
  }
};
