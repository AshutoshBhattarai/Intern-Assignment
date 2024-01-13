import { NextFunction, Request, Response } from "express";
import Status from "http-status-codes";
import BadRequestError from "../errors/BadRequest";
import ForbiddenError from "../errors/Forbidden";
import NotAcceptableError from "../errors/NotAcceptable";
import NotFoundError from "../errors/NotFound";
import UnauthorizedError from "../errors/Unauthorized";
import ValidationError from "../errors/Validation";
import logger from "../utils/logger";
const errorHandler = async (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.stack) {
    logger.error(err.stack);
  }
  if (err instanceof BadRequestError) {
    res.status(Status.BAD_REQUEST).json({ message: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(Status.UNAUTHORIZED).json({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(Status.FORBIDDEN).json({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(Status.NOT_FOUND).json({ message: err.message });
  } else if (err instanceof NotAcceptableError) {
    res.status(Status.NOT_ACCEPTABLE).json({ message: err.message });
  } else if (err instanceof ValidationError) {
    res.status(Status.BAD_REQUEST).json({ message: err.message });
  } else
    res.status(Status.INTERNAL_SERVER_ERROR).json({ message: err.message });
};

export default errorHandler;
