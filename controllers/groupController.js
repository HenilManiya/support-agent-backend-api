
const express = require('express');
const { check } = require('express-validator');
const { Role, Group } = require('../schemas/model');
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
    addGroup: async (req, res, next) => {
        try {
            let { id } = req.user
            console.log("in sdfdsf")
            log.debug("getting the list of roles");
            let body = {
                name: req.body.name,
                members: [...req.body.members, id],
                createdBy: id,
            }
            const roles = await Group.create(body)

            log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(roles, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
    getGroup: async (req, res, next) => {
        try {
            let { id } = req.user
            log.debug("getting the list of roles");
            const group = await Group.find({ members: { $in: id } }).populate({
                path: 'members',
                select: 'fullName _id profileImage phoneNumber',
            }).populate({
                path: 'createdBy',
                select: 'fullName _id profileImage phoneNumber',
            })

            return responseLib.handleSuccess(group,res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
    getGroupById: async (req, res, next) => {
        try {
            let { id } = req.params
            log.debug("getting the list of roles");
            const group = await Group.findById(id).populate({
                path: 'members',
                select: 'fullName _id profileImage phoneNumber',
            }).populate({
                path: 'createdBy',
                select: 'fullName _id profileImage phoneNumber',
            })

            return responseLib.handleSuccess(group,res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },

    getRolesForPermission: async (req, res, next) => {
        try {
            log.debug("getting the list of roles");
            const group = await Group.find();

            log.debug(`sending the list of ${group.length} roles`);
            return responseLib.handleSuccess(group, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
    updateGroup: async (req, res, next) => {
        try {
            let { id } = req.params;
            let { name, members } = req.body
            log.debug("getting the list of roles");
            let group = await Group.findById(id);
            if (!group) {
                return responseLib.handleError({ statusCode: 400, message: "GRoup does not exist" }, res);
            }
            const memberList = [...group.members.map((item) => item.toString()), ...members];

            let body = {
                ...(name ? { name: name } : {}),
                members: memberList.filter((item, index, self) => self.indexOf(item) === index)
            }
            group = await Group.findByIdAndUpdate(id, body, { new: true }).populate({
                path: 'members',
                select: 'fullName _id profileImage phoneNumber',
            }).populate({
                path: 'createdBy',
                select: 'fullName _id profileImage phoneNumber',
            })
            log.debug(`sending the list of ${group} roles`);
            return responseLib.handleSuccess(group,res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
};
