import winston from "winston";
import config from "@config/index";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(config.winston.console),
    new winston.transports.File(config.winston.file)
  ],
  exitOnError: false // do not exit on handled exceptions
});

export default logger;
