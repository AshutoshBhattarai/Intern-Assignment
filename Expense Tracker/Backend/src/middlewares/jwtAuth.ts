import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { errorResponse, unauthorizedResponse } from "../controllers/Response";
import config from "../configs";

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      unauthorizedResponse(res, {
        result: "No token provided",
      });
    const tokenUser = jwt.verify(token!, config.jwt.accessSecret);
    if (!tokenUser)
      unauthorizedResponse(res, {
        result: "Invalid token",
      });
    (req as any).user = (tokenUser as any).id;
    next();
  } catch (error: any) {
    errorResponse(res, {
      message: "Something went wrong",
      result: error.message,
    });
  }
};
