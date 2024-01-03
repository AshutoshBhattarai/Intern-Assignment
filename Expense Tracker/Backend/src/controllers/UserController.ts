import { Request, Response } from "express";
import * as userService from "../services/UserService";
import { errorResponse, successResponse } from "./Response";
import User from "../models/User";
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data: User[] = await userService.getAllUsers();
    successResponse(res, {
      message: "User Fetch Success",
      result: data.map((user: User) => filterUser(user)),
    });
  } catch (error: any) {
    errorResponse(res, { message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: User | null = await userService.getUserById(req.params.id);
    successResponse(res, {
      message: "User Fetch Success",
      result: filterUser(user!),
    });
  } catch (error: any) {
    errorResponse(res, { message: error.message });
  }
};

const filterUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
