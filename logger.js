const { createLogger, format, transports, config } = require("winston");
const moment = require("moment-timezone");
const os = require("os");
const cluster = require("cluster");

const timezone = "Asia/Kolkata";
const getHostAndProcessInfo = () => `[${os.hostname()} ${(cluster.isWorker ? "WORKER #" + cluster.worker.id : "MASTER")}]`;

const logColors = {
  debug: "white",
  data: "grey",
  error: "red",
  help: "cyan",
  info: "green",
  input: "grey",
  prompt: "grey",
  silly: "magenta",
  warn: "cyan",
  verbose: "cyan",
};

const localFormat = format.combine(
  format.colorize({
    colors: logColors,
    message: true,
  }),
  format.timestamp(),
  format.prettyPrint(),
  format.printf(({ level, message, label, timestamp }) => {
    timestamp = moment().format("YYYY.MM.DD HH:mm:ss");
    return `[${timestamp}] ${level
      .toUpperCase()
      .trim()} ${getHostAndProcessInfo()} ${message}`;
  })
);

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple(),
    format.printf(({ level, message, label, timestamp }) => {
      timestamp = moment().tz(timezone).format("DD.MM.YYYY HH:mm:ss");
      return `[${timestamp}] ${level
        .toUpperCase()
        .padEnd(8)} ${getHostAndProcessInfo()} ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      format: localFormat,
      name: "log-console",
      level: "debug",
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});
module.exports = logger;
