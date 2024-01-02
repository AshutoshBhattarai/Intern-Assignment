import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import loggerWithNameSpace from "../utils/logger";
import HttpStatus from "http-status-codes";
import { NotFoundError } from "../errors/NotFoundError";
const logger = loggerWithNameSpace("ErrorHandler");
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.stack) logger.error(err.stack);
  if (err instanceof BadRequestError)
    return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });

  if (err instanceof UnauthorizedError)
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: err.message });

  if (err instanceof NotFoundError)
    return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });

  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
};

export default errorHandler;
