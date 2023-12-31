import { Request, Response } from "express";
import * as userService from "../services/UserService";
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await userService.getAllUsers();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong !", error });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    await userService.addUser(req.body);
    res.status(200).json({ message: "User added successfully" });
  } catch (err: Error | any) {
    res.status(400).json({ message: err.message });
  }
};
