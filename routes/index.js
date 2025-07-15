const express = require("express");
const enums = require("../json/enums.json");
const { createResponseObject } = require("../utils/utils");
const path = require("path");
const userRoutes = require("./user");
const tourRoutes = require("./tour");
const embedScriptRoute = require('./embed');

module.exports = (app) => {
  // define all route imports here

  // define all routes here
  app.use("/user", userRoutes);
  app.use('/api', tourRoutes);
  app.use('/embed', embedScriptRoute);
  app.use("/images", express.static(path.join(__dirname, "../public/images")));
  /* Catch all */
  app.all("*", function (req, res) {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        result: -1,
        message:
          "Sorry! The request could not be processed!, Maybe wrong route called.",
        payload: {},
        logPayload: false,
      })
    );
  });
};
