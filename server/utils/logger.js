const pino = require("pino");

const isDev = process.env.NODE_ENV !== "production";

const logger = isDev
  ? pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    })
  : pino(); // No transport in production/serverless

module.exports = logger;
