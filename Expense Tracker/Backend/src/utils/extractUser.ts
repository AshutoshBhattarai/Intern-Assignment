import { Request } from "express";
import User from "../models/User";
import UnauthorizedError from "../errors/Unauthorized";
export const extractUserFromJwt = (req: Request) => {
  const request = req as any;
  if (!request.user) throw new UnauthorizedError("Invalid access token");
  const user = new User();
  user.id = request.user;
  return user;
};
