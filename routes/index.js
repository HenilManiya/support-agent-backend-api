const express = require('express');
const router = express.Router();
const enums = require("../json/enums.json");
const { createResponseObject } = require('../utils/utils');

module.exports = (app) => {
    // define all route imports here
    const userRoutes = require("./user");
    const roleRoutes = require("./role");
    const roomRoutes = require("./room");

    // define all routes here
    app.use("/user",  userRoutes);
    app.use("/role",  roleRoutes);
    app.use("/room",  roomRoutes);

    /* Catch all */
    app.all("*", function (req, res) {
        res.status(enums.HTTP_CODES.BAD_REQUEST).json(createResponseObject({
            req: req,
            result: -1,
            message: "Sorry! The request could not be processed!, Maybe wrong route called.",
            payload: {},
            logPayload: false
        }));
    }); 
};