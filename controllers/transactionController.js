const express = require("express");
const { check } = require("express-validator");
const {
  Role,
  Expense,
  GroupExpense,
  PendingReceive,
  User,
} = require("../schemas/model");
const { log } = require("../utils/lib/logger.lib");
const { responseLib } = require("../utils/lib");
const { formatter } = require("../utils/dateTimeFormate");
const {
  Types: { ObjectId: ObjectId },
} = require("mongoose");

module.exports = {
  /**
   * List down the all users information.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  addExpense: async (req, res, next) => {
    const { id } = req.user;
    const {
      title,
      userId,
      transactionType,
      amount,
      transactionDate,
      isGroupExpense,
      groupId,
      note,
      members,
    } = req.body;
    try {
      console.log("in sdfdsf", isGroupExpense);
      log.debug("getting the list of roles");
      let body = [];
      if (isGroupExpense) {
        let membersId = members.map((item) => item.id);
        const payload = {
          title: title,
          amount: amount,
          note: note,
          transactionDate: transactionDate,
          groupId: groupId,
          members: membersId,
          createdBy: id,
        };
        const groupExpense = await GroupExpense.create(payload);
        body = members.map((item) => {
          return {
            title: title,
            userId: item?.id,
            transactionType: transactionType,
            amount: item?.amount,
            transactionDate: transactionDate,
            // groupId: groupId,
            note: note,
            // members: membersId,
            createdBy: id,
            groupExpenseId: groupExpense?._id,
            // groupTotalAmount: amount,
          };
        });
      } else {
        body = [
          {
            title: title,
            userId: id,
            transactionType: transactionType,
            amount: amount,
            transactionDate: transactionDate,
            // groupId: groupId,
            note: note,
            // members: members,
            createdBy: id,
          },
        ];
      }
      console.log(body, "asdashbdhbaskjdbjkb");
      // body={
      //     title:title,
      //     transactionType:transactionType,
      //     transactionDate:transactionDate,
      //     amount:amount,
      //     note:note,
      //     userId:userId,
      // }
      const expense = await Expense.insertMany(body);
      console.log(expense, "expenseexpenseexpense");
      const payload = members
        ?.filter((data) => data?.isPayble)
        ?.map((item) => {
          return {
            title: title,
            paybleUserId: item?.id,
            transactionType: transactionType,
            amount: item?.amount,
            transactionDate: transactionDate,
            // groupId: groupId,
            note: note,
            // members: membersId,
            createdBy: id,
            expenseId: expense?.find((dta) => dta.userId == item?.id)?._id,
          };
        });
      const penfingreceive = await PendingReceive.insertMany(payload);

      // log.debug(`sending the list of ${roles.length} roles`);
      return responseLib.handleSuccess(expense, res);
    } catch (error) {
      // If there is an error, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 400, error }, res);
    }
  },
  getTransaction: async (req, res, next) => {
    const { id } = req.user;
    const { filterType, date } = req.query;
    try {
      log.debug("getting the list of roles");
      let { startDate, endDate } = await formatter.dateTimeFormat(
        filterType,
        date
      );
      const expense = await PendingReceive.find({
        $or: [{ paybleUserId: id }, { createdBy: id }],
        // transactionDate: { $gte: startDate, $lte: endDate },
      })
        .sort("-createdAt")
        .populate("paybleUserId")
        .populate("createdBy")
      console.log(expense, "expenseexpenseexpenseexpense");
      // log.debug(`sending the list of ${expense.length} roles`);
      return responseLib.handleSuccess(expense, res);
    } catch (error) {
      // If there is an error, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 400, error }, res);
    }
  },
  getExpenseByGroup: async (req, res, next) => {
    const { id } = req.params;
    try {
      log.debug("getting the list of roles");
      // const expense = await Expense.find({
      //     groupId: id,
      // });
      console.log(id, "ididid");
      const expense = await GroupExpense.find({ groupId: id });
      // const expense = await Expense.aggregate([
      //   {
      //     $match: {
      //       groupId: ObjectId(id),
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$groupId",
      //       data: {
      //         $push: "$$ROOT",
      //       },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "groups",
      //       localField: "_id",
      //       foreignField: "_id",
      //       as: "group",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$group",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      // ]);
      console.log(expense, "expenseexpense");
      // log.debug(`sending the list of ${expense.length} roles`);
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
  updateTransaction: async (req, res, next) => {
    try {
      let { id } = req.params;
      log.debug("getting the list of roles");
      const roles = await PendingReceive.findByIdAndUpdate(id, req.body, {
        new: true,
      }).populate("paybleUserId");

      const notifactionCount = await PendingReceive.find({
        paybleUserId: id,
        isPayed: false,
      }).count();
      const user = await User.findById(id);
      console.log(
        notifactionCount,
        "notifactionCountnotifactionCountnotifactionCount"
      );
      global.socket.in(user?.socket_id).emit("new-transaction", {
        notifactionCount: notifactionCount,
        type: "transaction",
      });
      global.socket.in(user?.socket_id).emit("new-notification", {
        message: `You have new transaction, Please check!`,
        type: "transaction",
      });
      console.log(roles, "rolesrolesroles");
      // log.debug(`sending the list of ${roles.length} roles`);
      return responseLib.handleSuccess(roles, res);
    } catch (error) {
      // If there is an error, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 400, error }, res);
    }
  },
};
