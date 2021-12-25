import appRoot from "app-root-path";

process.env.NODE_ENV = "development" || process.env.NODE_ENV;

export default {
  debugNamespace: "judge-taskmaster",
  winston: {
    file: {
      level: "info",
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    },
    console: {
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true
    }
  }
};
