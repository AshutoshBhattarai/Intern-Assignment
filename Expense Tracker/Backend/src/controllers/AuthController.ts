import { Request, Response } from "express";
import * as authService from "../services/AuthService";
import { errorResponse, successResponse } from "./Response";

export const login = async (req: Request, res: Response) => {
  try {
    const user: any = req.body;
    console.log(user);
    const response = await authService.login(user);
    successResponse(res, { message: "Login Success", result: response });
  } catch (error: any) {
    errorResponse(res, { message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user: any = req.body;
    const newUser = await authService.register(user);
    successResponse(res, {
      message: "User Registered Successfully",
      result: newUser,
    });
  } catch (error: any) {
    errorResponse(res, { message: error.message, result: error });
  }
};

export const logout = async (req: Request, res: Response) => {};

export const refresh = async (req: Request, res: Response) => {};



