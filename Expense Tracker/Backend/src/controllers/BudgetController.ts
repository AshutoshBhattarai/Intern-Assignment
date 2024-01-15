/* -------------------------------------------------------------------------- */
/*                              Budget Controller                             */
/* -------------------------------------------------------------------------- */

import { NextFunction, Request, Response } from "express";
import * as budgetService from "../services/BudgetService";
import HttpStatus from "http-status-codes";
import Budget from "../models/Budget";
import { BudgetQuery } from "../interface/QueryInterface";
import User from "../models/User";
/* Note :
->res.locals is an object that contains response local variables scoped to the request
->This is useful for passing data between middleware and controllers
 ->In this case, res.locals.user is a User object that contains the authenticated user's information
 ->Which is then used in every route that requires authentication
 ->The user object is generated in the authMiddleware by verifying the JWT token 
*/

// Create Budget
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

// Get All Budgets
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

export const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budget: Budget = req.body;
    const user = res.locals.user;
    await budgetService.updateBudget(user, budget);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Budget updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    await budgetService.deleteBudget(user, req.params.id);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFilteredBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const queries: BudgetQuery = req.query;
    const budgets = await budgetService.getFilteredBudget(user, queries);
    res.status(HttpStatus.OK).json({
      message: "Budgets fetched successfully",
      result: budgets,
    });
  } catch (error) {
    next(error);
  }
};
