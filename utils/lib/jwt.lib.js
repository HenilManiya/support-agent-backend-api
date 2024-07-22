const jwt = require('jsonwebtoken');
const { log } = require('./logger.lib');

const JWT_SECRET = "0a6b944d-d2fb-46fc-a85e-0295c986cd9f";

exports.encodeToken = function (data) {
    try {
        log.debug("data to be encoded", data,JWT_SECRET);
        const token = jwt.sign(data, JWT_SECRET);
        return token;
    } catch (error) {
        log.error("error while encoding the token", error);
        return error;
    }
}

exports.decodeToken = function (encToken) {
    try {
        const token = jwt.verify(encToken, JWT_SECRET);
        return token;
    } catch (error) {
        log.error("error while decoding the token", error);
        return error;
    }
}