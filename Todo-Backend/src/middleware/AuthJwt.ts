import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { CustomRequest } from "../interfaces/CustomRequest";

export const authJwt = (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as CustomRequest;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) res.status(401).json({ message: "Unauthorized" });
  else {
    try {
      const decoded = jwt.verify(token, config.jwt.accessTokenSecret!);
      req.user = decoded as any;
      next();
    } catch (error) {
      res.status(401).send({
        message: "Unauthorized",
      });
    }
  }
};
