import { Response } from "express";
type ResponseData = {
  message: string;
  result?: Object | Object[];
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
