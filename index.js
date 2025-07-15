const express = require('express');
const http = require("http");
const mongoServer = require('./config/db');
const cors = require('cors');
const initRouter = require("./routes/index");


// const rateLimit = require("express-rate-limit");
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message:
//     "Too many request from this IP, please try again after an hour"
// });

const logger = require("./logger");
logger.info("Logger Initialized!");

const { jwtauthentication } = require('./middleware/middleware');
const config = require('./config/config');

const PORT = config.PORT;
// const HOST = config.HOST
// initiate mongodb server
mongoServer(logger);
const app = express();

// middlewares
const corsOpts = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  };
app.use(cors(corsOpts));
app.use(express.json());
// app.use(apiLimiter);
app.use('/static', express.static(__dirname + '/static'));
// app.use(logIncomingRequest);

// Routes
initRouter(app, logger);

// Start server
const server = http.createServer(app);
server.listen(PORT, async () => {
    logger.info('Your app is runing in port ' + PORT);
});



