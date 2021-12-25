import { CommonRoutesConfig } from "@common/common.routes.config";
import express from "express";
import submitController from "./controllers/submit.controller";

export class SubmitRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "SubmitRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route("/submit").post(submitController.submit);
    return this.app;
  }
}
