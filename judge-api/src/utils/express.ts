import { ResponseObject } from "./types";
import { Response, NextFunction } from "express";
import createError from "http-errors";
import logger from "./logger";
import { StatusCodes } from "http-status-codes";

export const formatResponse = (payload: ResponseObject): void => {
  const { res, result, error = null, status = 200 } = payload;
  res.status(status).json({
    status,
    result,
    error
  });
};

export const unprocessableEntityError = (
  error: Error,
  res: Response,
  next: NextFunction
): void => {
  logger.error(error);
  res.status(StatusCodes.UNPROCESSABLE_ENTITY);
  next(createError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
};
