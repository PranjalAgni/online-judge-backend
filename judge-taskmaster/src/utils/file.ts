import fs from "fs";
import path from "path";
import config from "@config/index";
import { CodeFileData } from "./types";
import debug from "debug";

const debugLog: debug.IDebugger = debug(`${config.debugNamespace}:utils-file`);

export const createRunbox = (): void => {
  const runBoxDir = config.runBox;
  if (!fs.existsSync(runBoxDir)) {
    fs.mkdirSync(runBoxDir);
  }
};

export const writeCodeFile = (data: CodeFileData): void => {
  const filePath = path.join(config.runBox, data.name);
  fs.writeFileSync(filePath, data.code, "utf8");
  debugLog(`Wrote the source ${filePath.toString()}`);
};

export const deleteCodeFile = (fileName: string): void => {
  const filePath = path.join(config.runBox, fileName);
  fs.unlinkSync(filePath);
  debugLog(`Deleted the file ${fileName}`);
};
