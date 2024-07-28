const _ = require("lodash");
const logger = require("../logger");

let functions = {};

functions.sortByKeys = (obj) => {
  if (_.isEmpty(obj)) {
    return obj;
  }

  const sortedObj = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key];
    });

  return sortedObj;
};

/* create response-wrapper object */
functions.createResponseObject = ({
  req,
  result = 0,
  message = "",
  payload = {},
  logPayload = false,
}) => {
  let payload2log = {};
  if (logPayload) {
    payload2log = flatten({ ...payload });
  }

  let messageToLog = `RES [${req.requestId}] [${req.method}] ${req.originalUrl}`;
  messageToLog +=
    (!_.isEmpty(message) ? `\n${message}` : "") +
    (!_.isEmpty(payload) && logPayload
      ? `\npayload: ${JSON.stringify(payload2log, null, 4)}`
      : "");

  if (result < 0 && (result !== -50 || result !== -51)) {
    logger.error(messageToLog);
  } else if (!_.isEmpty(messageToLog)) {
    logger.info(messageToLog);
  }

  return { result: result, message: message, payload: payload };
};

/* Return true if the app is in production mode */
functions.isLocal = () => process.env.APP_ENVIRONMENT.toLowerCase() === "local";

/* Return true if the app is in production mode */
functions.isProduction = () =>
  process.env.APP_ENVIRONMENT.toLowerCase() === "production" ||
  process.env.APP_ENVIRONMENT.toLowerCase() === "prod";

/* Return true if the app is in production mode */
functions.isTest = () => process.env.APP_ENVIRONMENT.toLowerCase() === "test";

/* Email validation */
functions.validateEmail = (email) => {
  if (_.isEmpty(email)) {
    return false;
  }
  const regex = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
  );
  return regex.test(email);
};

/* Get token from header */
functions.getHeaderFromToken = async (token) => {
  const decodedToken = jwtDecode(token, {
    complete: true,
  });

  if (!decodedToken) {
    return null;
  }

  return decodedToken;
};
module.exports = exports = functions;
