import config from "@config/index";
import { queueJob } from "@rabbitmq/jobqueue";
import { CreateSubmitStruct } from "@submit/dtos/submit.dto";
import { formatResponse } from "@utils/express";
import logger from "@utils/logger";
import debug from "debug";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";
import { create } from "superstruct";

const debugLog: debug.IDebugger = debug(
  `${config.debugNamespace}:submit-controller`
);

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
      logger.info("Recieved submit request");
      const submitData = create(req.body, CreateSubmitStruct);
      debugLog(`Request reached ${JSON.stringify(submitData)}`);
      await queueJob({
        id: nanoid(6),
        source: submitData.source,
        lang: submitData.lang,
        timelimit: submitData.timelimit,
        testcases: submitData.testcases,
        scenario: submitData.scenario
      });
      return formatResponse({ res, result: "success" });
    } catch (ex) {
      logger.error(ex.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      return next(createError(StatusCodes.INTERNAL_SERVER_ERROR, ex.message));
    }
  }
}

export default SubmitController.getInstance();
