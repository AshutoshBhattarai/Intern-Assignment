import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const logHandler = (req: Request, _res: Response, _next: NextFunction) => {
  logger.info(`${req.method}: ${req.path}`);
};
export default logHandler;
