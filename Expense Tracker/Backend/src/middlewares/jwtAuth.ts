import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import config from "../configs/Index";
import ForbiddenError from "../errors/Forbidden";
import UnauthorizedError from "../errors/Unauthorized";

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ForbiddenError("No token provided");
    const tokenUser = jwt.verify(token!, config.jwt.accessSecret);
    if (!tokenUser) throw new ForbiddenError("Invalid access token");
    else {
      (req as any).user = (tokenUser as any).userid;
      next();
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError("Access Token has expired!");
    }
    if (error instanceof NotBeforeError) {
      throw new UnauthorizedError("JWT is not active");
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("JWT is malformed");
    }
    next(error);
  }
};
