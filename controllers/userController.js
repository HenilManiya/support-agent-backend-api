const crypto = require("crypto");
const config = require("../config/config");

const { validationResult } = require("express-validator");
const { User } = require("../schemas/model");
const { log } = require("../utils/lib/logger.lib");
const { responseLib, jwt } = require("../utils/lib");

//schema
module.exports = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let query = { email: email };

      let checkUser = await User.findOne(query);

      if (checkUser) {
        return res.status(400).send({
          msg: "Email already exists",
        });
      }
      let body = {
        name: name,
        email: email,
        password: password,
      };
      checkUser = await User.create(body);
      // const savedData = await user.save();
      const userTokenData = {
        id: checkUser?._id,
        email: checkUser?.email,
      };
      const token = jwt.encodeToken(userTokenData);
      delete checkUser._doc.password;
      return responseLib.handleSuccess(
        { token, user: checkUser, message: "SignUp Successfully" },
        res
      );
      // jwt.sign(payload,
      //     jwtSecrets,
      //     { expiresIn: jwtExpiresIn },
      //     (err, token) => {
      //         if (err) {
      //             throw err;
      //         } else {
      //             let data = {
      //                 ...user._doc,
      //                 token: token
      //             };
      //             res.status(200).send(data);

      //         }
      //     });
    } catch (e) {
      res.status(500).send({ msg: "Error in signup" });
    }
  },

  login: async (req, res, next) => {
    try {
      // Extract the firebaseId, email, and name from the request body
      const { email, password } = req.body;

      let checkUser = await User.findOne({
        email: email,
        password: password,
      });
      console.log(checkUser, "checkUsercheckUsercheckUser");
      if (!checkUser) {
        return responseLib.handleError(
          { statusCode: 404, error: "User not found" },
          res
        );
      }
      //check if password is correct
      // let checkPassword = await checkUser.comparePassword(password);
      // if (!checkPassword) {
      //     return responseLib.handleError(
      //         { statusCode: 401, error: "Incorrect password" },
      //         res
      //     );
      // }
      // Log that we are storing the user data to the database
      log.debug("storing the user data to the db", checkUser);
      // Create token
      const userTokenData = {
        id: checkUser?._id,
        email: checkUser?.email,
      };
      const token = jwt.encodeToken(userTokenData);
      delete checkUser._doc.password;

      await User.findByIdAndUpdate(checkUser._id, { token });
      return responseLib.handleSuccess(
        { token, user: checkUser, message: "Login Successfully" },
        res
      );
    } catch (error) {
      // If there is an exception, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 500, error }, res);
    }
  },

  forgotPassword: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({
        msg: errors.array()[0].msg,
      });
    } else {
      const email = req.body.email;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          res.status(400).send({
            msg: "User not exists!",
          });
        } else {
          user.resetPasswordToken = crypto.randomBytes(24).toString("hex");
          user.resetPasswordExpires = Date.now() + 1 * 3600 * 1000;
          var link = `${config.webUri}/reset-password/${user.resetPasswordToken}`;
          let subject = "Password Reset Request";
          let html = `<p> Click the link below <br> ${link} <br> to reset your password </p>`;
          await user.save();
          services
            .emailService(email, subject, html)
            .then(() => {
              res.status(200).send({
                msg: `A password reset mail send to your email ${email}`,
              });
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      } catch (e) {
        console.log(e);
        res.status(500).send({
          msg: "Unable to send request!",
        });
      }
    }
  },
  verifyOtp: async (req, res) => {
    const { user } = req.user;
    const { isVerify } = req.body;
    if (!user) {
      res.status(200).send({
        msg: "User not found!",
      });
    }
    try {
      // const isVerified = await OtpVerify.findById(phoneNumber: p, { $set: {
      //     isVerified: isVerify
      // }});
      // if(isVerified) {
      //     res.status(200).send({
      //         msg: "User verified!"
      //     });
      // }
    } catch (e) {
      res.status(500).send({
        msg: "Unable to verify otp",
      });
    }
  },
  updateUser: async (req, res, next) => {
    let id = req.params;
    try {
      // Extract the firebaseId, email, and name from the request body
      const { phoneNumber, name, email } = req.body;
      const profileImage = req?.file;
      let checkUser = await User.findById({ phoneNumber: phoneNumber });
      if (!checkUser) {
        return responseLib.handleError(
          { statusCode: 404, error: "User not found" },
          res
        );
      }
      let body = {
        name: name,
        email: email,
        ...(profileImage ? { profileImage: profileImage?.filename } : {}),
      };
      let user = await User.findByIdAndUpdate(checkUser._id, body, {
        new: true,
      });

      return responseLib.handleSuccess({ user }, res);
    } catch (error) {
      // If there is an exception, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 500, error }, res);
    }
  },
  getUser: async (req, res, next) => {
    let { search } = req.query;
    console.log(search, "asdsahhasbs");
    try {
      let user = await User.find({
        $or: [
          { phoneNumber: { $regex: new RegExp(search, "i") } },
          { name: { $regex: new RegExp(search, "i") } },
        ],
      }).select("_id name profileImage phoneNumber");

      if (!user) {
        return responseLib.handleError(
          { statusCode: 404, error: "User not found" },
          res
        );
      }
      log.debug("storing the user data to the db", user);
      return responseLib.handleSuccess(user, res);
    } catch (error) {
      // If there is an exception, log the error and return an error response
      log.error(error);
      return responseLib.handleError({ statusCode: 500, error }, res);
    }
  },
};
