import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../configs/Index";
import ForbiddenError from "../errors/Forbidden";

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ForbiddenError("No token provided");
    const tokenUser = jwt.verify(token!, config.jwt.accessSecret);
    if (!tokenUser) throw new ForbiddenError("Invalid access token");
    else {
      console.log(tokenUser);
      (req as any).user = (tokenUser as any).userid;
      next();
    }
  } catch (error) {
    throw error;
  }
};
