import { Response } from "express";
type ResponseData = {
  message?: string;
  result?: Object | Object[] | null;
};
export const successResponse = (res: Response, data: ResponseData) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: data.message,
    data: data.result,
  });
};

export const errorResponse = (res: Response, data: ResponseData) => {
  res.status(400).json({
    success: false,
    errorCode: 400,
    message: data.message,
    data: data.result,
  });
};

export const unauthorizedResponse = (res: Response, data: ResponseData) => {
  res.status(403).json({
    success: false,
    errorCode: 403,
    message: "Unauthorized",
    data: data.result,
  });
}
