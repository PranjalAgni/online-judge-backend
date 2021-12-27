require("module-alias/register");
import logger from "@utils/logger";
import * as amqp from "amqplib/callback_api";
import { Channel, Connection } from "amqplib/callback_api";
import queueConfig from "./queue.config";
import debug from "debug";
import config from "@config/index";
import { createRunbox, deleteCodeFile, writeCodeFile } from "./utils/file";

const debugLog: debug.IDebugger = debug(`${config.debugNamespace}`);

// creates run box if it does not exist already
createRunbox();

amqp.connect(
  "amqp://localhost:5672",
  function (err: Error, connection: Connection) {
    if (err) throw err;
    logger.info("Connected to rabbitmq");
    connection.createChannel((err: Error, channel: Channel) => {
      if (err) throw err;
      logger.info("Successfully created channel");
      channel.assertQueue(queueConfig.jobQueue, { durable: true });
      channel.assertQueue(queueConfig.successQueue, { durable: true });

      channel.consume(queueConfig.jobQueue, (msg) => {
        try {
          const jobData = JSON.parse(msg.content.toString());
          debugLog("Jobdata: " + JSON.stringify(jobData, undefined, 2));
          writeCodeFile({
            name: `solution-${jobData.id}.cpp`,
            code: jobData.source
          });
          const jobResult = {
            ...jobData,
            status: "success"
          };

          deleteCodeFile(`solution-${jobData.id}.cpp`);
          channel.sendToQueue(
            queueConfig.successQueue,
            Buffer.from(JSON.stringify(jobResult))
          );
        } catch (error) {
          logger.error(error);
        }
        channel.ack(msg);
      });
    });
  }
);
