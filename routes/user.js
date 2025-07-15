const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

//schema
let emailCheck = check("email", "Invalid email Address!")
  .isEmail()
  .not()
  .isEmpty();
let phoneNumberCheck = check("phoneNumber")
  .isMobilePhone()
  .withMessage("invalid phone number!")
  .not()
  .isEmpty()
  .withMessage("phone number is required!");
let passChecks = check("password", "Invalid Password!").matches(
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{12,}$/
);

// controller
const userController = require("../controllers/userController");
const { middleware } = require("../middleware/middleware");
const { uploadFile } = require("../utils/s3.utils");

//user routes

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.put(
  "/update-profile/:id",
  uploadFile.single("profileImage"),
  userController.updateUser
);
router.get("/getuser", middleware.auth, userController.getUser);

router.get("/verifyOtp", userController.verifyOtp);

module.exports = router;
