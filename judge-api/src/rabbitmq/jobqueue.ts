import * as amqp from "amqplib/callback_api";
import config from "@config/index";
import debug from "debug";
import queueConfig from "@rabbitmq/queue.config";
import logger from "@utils/logger";

const debugLog: debug.IDebugger = debug(`${config.debugNamespace}:jobqueue`);
let jobChannel: amqp.Channel = null;

/**
 * Connect to RabbitMQ and save channel to
 * @link {jobChannel}
 */
amqp.connect("amqp://localhost:5672", function (err, connection) {
  if (err) throw err;
  logger.info("Connected to rabbitmq");
  connection.createChannel((err, channel) => {
    if (err) throw err;
    logger.info("Successfully created channel");
    channel.assertQueue(queueConfig.jobQueue, { durable: true });
    channel.assertQueue(queueConfig.successQueue, { durable: true });
    jobChannel = channel;

    jobChannel.consume(queueConfig.successQueue, (msg) => {
      debugLog(`SUCCESS:CONSUME: msg.content = ${msg.content.toString()}`);
      jobChannel.ack(msg);
    });
  });
});

export const queueJob = (
  job: object,
  queueName: string = queueConfig.jobQueue
) => {
  return jobChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), {
    persistent: true
  });
};
