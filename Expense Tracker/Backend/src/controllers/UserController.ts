import { Request, Response } from "express";
import * as userService from "../services/UserService";
import { errorResponse, successResponse } from "./Response";
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await userService.getAllUsers();
    successResponse(res, { message: "User Fetch Success", result: data });
  } catch (error: any) {
    errorResponse(res, { message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
