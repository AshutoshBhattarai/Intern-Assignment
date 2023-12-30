import { Request, Response } from "express";
import * as authService from "../service/AuthService";

export const signup = async (req: Request, res: Response) => {
  const { body } = req;
  const message = await authService.signup(body);
  res.json({
    message,
  });
};

export const login = async (req: Request, res: Response) => {
  const { body } = req;
  const data = await authService.login(body);
  res.json({
    ...data,
    message: data.message,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.body.token;
  const data = await authService.refreshToken(token);
  res.json({ data });
};
