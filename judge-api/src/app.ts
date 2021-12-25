import { loggerStreamWrite } from "@utils/logger";
import compression from "compression";
import cors from "cors";
import debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "@config/index";
import { CommonRoutesConfig } from "./modules/common/common.routes.config";
import { SubmitRoutes } from "./modules/submit/submit.routes";

const initalizeApp = async (): Promise<express.Application> => {
  const app: express.Application = express();
  const routes: Array<CommonRoutesConfig> = [];
  const debugLog: debug.IDebugger = debug(`${config.debugNamespace}:app`);

  // If we are behind some reverse proxy like Nginx then we can trust this X-Forwarded-For header
  // Read More: https://stackoverflow.com/questions/39930070/nodejs-express-why-should-i-use-app-enabletrust-proxy
  app.enable("trust proxy");

  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(
    morgan("combined", {
      stream: {
        write: loggerStreamWrite
      }
    })
  );

  routes.push(new SubmitRoutes(app));

  app.get("/", (_req: express.Request, res: express.Response) => {
    debugLog(_req.headers);
    res
      .status(200)
      .send(`Server running at http://localhost:${process.env.PORT}`);
  });

  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  CommonRoutesConfig.applyErrorHandleMiddlewares(app);
  return app;
};

export default initalizeApp;
