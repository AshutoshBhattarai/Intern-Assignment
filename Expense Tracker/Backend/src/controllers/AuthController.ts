import { NextFunction, Request, Response } from "express";
import * as authService from "../services/AuthService";
import HttpStatus from "http-status-codes";
import User from "../models/User";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = req.body;
    const response = await authService.login(user);
    res.status(HttpStatus.ACCEPTED).json({
      message: "User logged in successfully",
      tokens: response,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = req.body;
    await authService.register(user);
    res.status(HttpStatus.ACCEPTED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    await authService.logout(user);
    res.status(HttpStatus.ACCEPTED).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.body.refreshToken;
    const response = await authService.refresh(token);
    res.status(HttpStatus.ACCEPTED).json({
      message: "User tokens updated successfully",
      tokens: response,
    })
  } catch (error) {
    next(error);
  }
};
