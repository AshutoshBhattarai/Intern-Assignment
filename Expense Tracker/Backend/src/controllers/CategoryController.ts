import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/CategoryService";
import HttpStatus from "http-status-codes";
import Category from "../models/Category";
import User from "../models/User";
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category: Category = req.body;
    category.user = (req as any).user;
    console.log((req as any).user);
    const response = await categoryService.createCategory(category);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Category created successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user;
    const user = new User();
    user.id = userId;
    const response = await categoryService.getAllCategories(user);
    res.status(HttpStatus.OK).json({
      message: "Categories fetched successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await categoryService.getCategory(req.params.id);
    res.status(HttpStatus.OK).json({
      message: "Category fetched successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category: Category = req.body;
    const { id } = req.params;
    category.id = id;
    category.user = new User().id = (req as any).user;
    const response = await categoryService.updateCategory(
      category.user,
      category
    );
    res.status(HttpStatus.ACCEPTED).json({
      message: "Category updated successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const response = await categoryService.deleteCategory(user, id);
    res.status(HttpStatus.OK).json({
      message: "Category deleted successfully",
      result: response,
    });
  } catch (error) {
    next(error);
  }
};
