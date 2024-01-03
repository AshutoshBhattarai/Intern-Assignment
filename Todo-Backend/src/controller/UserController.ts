import { Request, Response } from "express";
import * as userService from "../service/UserService";
import { NotFoundError } from "../errors/NotFoundError";
export const getUsers = (req: Request, res: Response) => {
  const users = userService.getAllUsers();
  res.json({
    users,
  });
};

export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = userService.getUserById(id);
  if (user) return res.json({ message: user });
  else throw new NotFoundError("User not found");
};

export const getUserByEmail = (req: Request, res: Response) => {
  const email = req.params.email;
  const user = userService.getUserByEmail(email);
  if (user) return res.json({ message: user });
  else throw new NotFoundError("User not found");
};
