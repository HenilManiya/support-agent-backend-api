
const express = require('express');
const { check } = require('express-validator');
const { Role, Message } = require('../schemas/model');
const { log } = require('../utils/lib/logger.lib');
const { responseLib } = require('../utils/lib');
const router = express.Router();

module.exports = {
    getMessageHistory: async (req, res, next) => {
        try {
            const { roomId } = req.params
            log.debug("getting the list of roles");
            console.log(roomId,"roomIdroomIdroomIdroomId")
            const roles = await Message.find({
                roomId: roomId
            });
            console.log(roles,"rolesrolesroles")

            log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(roles, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },

};
