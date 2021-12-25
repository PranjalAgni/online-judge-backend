import { formatResponse } from "@utils/express";
import logger from "@utils/logger";
import debug from "debug";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import config from "@config/index";

const debugLog: debug.IDebugger = debug(`${config}:submit-controller`);

class SubmitController {
  private static instance: SubmitController;

  static getInstance(): SubmitController {
    if (!SubmitController.instance) {
      SubmitController.instance = new SubmitController();
    }

    return SubmitController.instance;
  }

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      debugLog("Request reached");
      return formatResponse({ res, result: "success" });
    } catch (ex) {
      logger.error(ex.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      return next(createError(StatusCodes.INTERNAL_SERVER_ERROR, ex.message));
    }
  }
}

export default SubmitController.getInstance();
