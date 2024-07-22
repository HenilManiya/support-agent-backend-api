
const express = require('express');
const { check } = require('express-validator');
const { Role, Room } = require('../schemas/model');
const { log } = require('../utils/lib/logger.lib');
const { responseLib } = require('../utils/lib');
const router = express.Router();

module.exports = {
    /**
     * List down the all users information.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {function} next - The next middleware function.
     */

    getRooms: async (req, res, next) => {
        let { id } = req.user
        try {
            log.debug("getting the list of roles");
            const rooms = await Room.find({
                users: { $in: id ,}
            }).populate({
                path: 'users',
                select: 'fullName _id profileImage',
                match: { _id: { $ne: id } } // Exclude your own user data from population
            }).populate("lastMessage");

            log.debug(`sending the list of ${rooms.length} roles`);
            return responseLib.handleSuccess(rooms, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },

    addRoles: async (req, res, next) => {
        try {
            console.log("in sdfdsf")
            log.debug("getting the list of roles");
            const roles = await Role.create(req.body);

            log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(roles, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },

    getRolesForPermission: async (req, res, next) => {
        try {
            log.debug("getting the list of roles");
            const roles = await Role.find();

            log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(roles, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
    updateRolePermisson: async (req, res, next) => {
        try {
            let { id } = req.params;
            log.debug("getting the list of roles");
            const roles = await Role.findByIdAndUpdate(id, req.body, { new: true });


            log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(roles, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
};
