
const express = require('express');
const { check } = require('express-validator');
const { Role, Expense } = require('../schemas/model');
const { log } = require('../utils/lib/logger.lib');
const { responseLib } = require('../utils/lib');
const { formatter } = require('../utils/dateTimeFormate');

module.exports = {
    /**
     * List down the all users information.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {function} next - The next middleware function.
     */
    addExpense: async (req, res, next) => {
        const { id } = req.user
        const { title, userId, transactionType, amount, transactionDate, isGroupExpense, groupId, note, members } = req.body;
        try {
            console.log("in sdfdsf")
            log.debug("getting the list of roles");
            let body = []
            if (isGroupExpense) {
                let membersId = members.map((item) => item.id)
                body = members.map((item) => {
                    return {
                        title: title,
                        userId: item?.id,
                        transactionType: transactionType,
                        amount: item?.amount,
                        transactionDate: transactionDate,
                        isGroupExpense: isGroupExpense,
                        groupId: groupId,
                        note: note,
                        members: membersId,
                        createdBy: id,
                        groupTotalAmount: amount
                    }
                })
            } else {
                body = [
                    {
                        title: title,
                        userId: id,
                        transactionType: transactionType,
                        amount: amount,
                        transactionDate: transactionDate,
                        isGroupExpense: isGroupExpense,
                        // groupId: groupId,
                        note: note,
                        // members: members,
                        createdBy: id
                    }
                ]
            }
            console.log(body, "asdashbdhbaskjdbjkb")
            // body={
            //     title:title,
            //     transactionType:transactionType,
            //     transactionDate:transactionDate,
            //     amount:amount,
            //     note:note,
            //     userId:userId,
            // }
            const expense = await Expense.insertMany(body);

            // log.debug(`sending the list of ${roles.length} roles`);
            return responseLib.handleSuccess(expense, res);
        } catch (error) {
            // If there is an error, log the error and return an error response
            log.error(error);
            return responseLib.handleError({ statusCode: 400, error }, res);
        }
    },
    getExpense: async (req, res, next) => {
        const { id } = req.user
        const { filterType, date } = req.query
        try {
            console.log(req.query,"req.query")
            log.debug("getting the list of roles");
            let { startDate, endDate } = await formatter.dateTimeFormat(filterType, date)
            console.log(startDate, endDate ," startDate, endDate ")
            const expense = await Expense.find({
                userId: id,
                createdAt: { $gte: startDate, $lte: endDate }
            });

            log.debug(`sending the list of ${expense.length} roles`);
            return responseLib.handleSuccess(expense, res);
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
