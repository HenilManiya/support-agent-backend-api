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
const socketIo = require("../socket/socket-io");

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
        membersId.map(async (item) => {
          if (item == id) return;
          const user = await User.findById(item);
          const notifactionCount = await Expense.find({
            userId: item,
            isRead: false,
          }).count();
          global.socket.in(user?.socket_id).emit("new-expense", {
            notifactionCount: notifactionCount.length,
            type: "expense",
          });
          global.socket.in(user?.socket_id).emit("new-notification", {
            message: `You have new expense, Please check!`,
            type: "expense",
          });
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
      members
        ?.filter((data) => data?.isPayble)
        ?.map(async (item) => {
          const user = await User.findById(item?.id);
          console.log(user, "useruseruser");
          const notifactionCount = await PendingReceive.find({
            paybleUserId: item?.id,
            isPayed: false,
          }).count();
          console.log(notifactionCount,"notifactionCountnotifactionCountnotifactionCount")
          global.socket.in(user?.socket_id).emit("new-transaction", {
            notifactionCount: notifactionCount,
            type: "transaction",
          });
          global.socket.in(user?.socket_id).emit("new-notification", {
            message: `You have new transaction, Please check!`,
            type: "transaction",
          });
        });
      // log.debug(`sending the list of ${roles.length} roles`);
      return responseLib.handleSuccess(expense, res);
    } catch (error) {
      // If there is an error, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 400, error }, res);
    }
  },
  getExpense: async (req, res, next) => {
    const { id } = req.user;
    const { filterType, date } = req.query;
    try {
      log.debug("getting the list of roles");
      let { startDate, endDate } = await formatter.dateTimeFormat(
        filterType,
        date
      );
      const expense = await Expense.find({
        userId: id,
        transactionDate: { $gte: startDate, $lte: endDate },
      }).sort("-createdAt");
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
  getExpenseChartData: async (req, res, next) => {
    const { id } = req.user;
    const { month } = req.query;
    try {
      log.debug("getting the list of roles");
      // let { startDate, endDate } = await formatter.dateTimeFormat(
      //   filterType,
      //   date
      // );
      // function getFirstDateOfMonthsBefore(monthsBefore) {
      //   // Validate the input (must be a non-negative integer)
      //   if (monthsBefore < 0) {
      //     throw new Error("Months before must be a non-negative integer");
      //   }

      //   // Get the current date
      //   const currentDate = new Date();

      //   // Calculate the target date by subtracting the specified months
      //   const targetDate = new Date(
      //     currentDate.getFullYear(),
      //     currentDate.getMonth() - monthsBefore,
      //     1
      //   );

      //   // Format the date as DD-MM-YYYY
      //   // const formattedDate = `${String(targetDate.getDate()).padStart(2, '0')}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${targetDate.getFullYear()}`;

      //   return targetDate;
      // }
      function getLastMonthsDateRange(months) {
        // Validate the input (must be a positive integer)
        if (months <= 0) {
          throw new Error("Months must be a positive integer");
        }

        // Get the current date
        const currentDate = new Date();

        // Calculate the starting date (first day of the month from months ago)
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - months + 1,
          1
        );

        // Calculate the ending date (last day of the current month)
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ); // 0 means last day of the previous month

        // Format the dates as DD/MM/YYYY
        // const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`;
        // const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`;

        return {
          startDate: startDate,
          endDate: endDate,
        };
      }
      console.log(getLastMonthsDateRange(month), " getFormattedDate(month)");
      let { startDate, endDate } = getLastMonthsDateRange(month);
      const expense = await Expense.aggregate(
        [
          {
            $match: {
              userId: ObjectId(id),
              createdAt: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" }, // Extract year
                month: { $month: "$createdAt" }, // Extract month
              },
              data: {
                $push: "$$ROOT", // Push the entire document into the data array
              },
            },
          },
          {
            $project: {
              amount: {
                $sum: "$data.amount", // Sum the amounts from the data
              },
              _id: 1, // Keep the _id (which contains year and month)
            },
          },
          {
            $sort: {
              "_id.year": 1, // Sort by year
              "_id.month": 1, // Sort by month
            },
          },
        ]
        //   [
        //   {
        //     $match: {
        //       userId: ObjectId(id),
        //       createdAt: {
        //         $gte: getFirstDateOfMonthsBefore(month),
        //         $lt: new Date()
        //       },
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         $dateToString: {
        //           format: "%Y-%m-%d",
        //           date: "$createdAt",
        //         },
        //       },
        //       data: {
        //         $push: "$$ROOT",
        //       },
        //     },
        //   },
        //   {
        //     $project: {
        //       amount: {
        //         $sum: "$data.amount",
        //       },
        //     },
        //   },
        //   {
        //     $sort: {
        //       _id: 1
        //     }
        //   }
        // ]
      );

      console.log(expense, "expenseexpense", id);
      // log.debug(`sending the list of ${expense.length} roles`);
      return responseLib.handleSuccess(expense, res);
    } catch (error) {
      // If there is an error, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 400, error }, res);
    }
  },
};
