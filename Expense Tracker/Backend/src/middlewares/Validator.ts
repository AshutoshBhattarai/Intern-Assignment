import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import ValidationError from "../errors/Validation";

export const validateRequestBody =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new ValidationError(error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export const validateRequestQuery =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.query);
      if (error) {
        throw new ValidationError(error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
