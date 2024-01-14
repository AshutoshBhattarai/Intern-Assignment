import { NextFunction, Request, Response } from "express";
import * as incomeService from "../services/IncomeService";
import { getIncomeCount } from "../repositories/IncomeRepo";
import Income from "../models/Income";
import HttpStatus from "http-status-codes";
import User from "../models/User";
import { IncomeQuery } from "../interface/QueryInterface";
import createResponseMeta from "../utils/metadata";

export const createIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomeDetails: Income = req.body;
    const user: User = res.locals.user;
    await incomeService.createIncome(user, incomeDetails);
    res.status(HttpStatus.ACCEPTED).send({
      message: "Income created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const params: IncomeQuery = req.query;
    const data = await incomeService.getUserIncome(user, params);
    const meta = createResponseMeta(await getIncomeCount(user, params));
    res.status(HttpStatus.OK).json({
      message: "Income returned successfully",
      result: data,
      meta
    });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const income: Income = req.body;
    await incomeService.updateIncome(user, income);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Income updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const { id } = req.params;
    await incomeService.deleteIncome(user, id);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Income deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
