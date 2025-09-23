const express = require("express");
const { authController } = require("../controllers");
const {
  signUpValidator,
  signInValidator,
  otpEmailVerification,
  emailVerification,
  updatePasswordVerification,
} = require("../validators/auth");

const { isAuthMiddleware } = require("../middlewares");
const router = express.Router();
const validate = require("../validators/validate");

router.post("/signup", signUpValidator, validate, authController.signup);

router.post("/signin", signInValidator, validate, authController.login);

router.post(
  "/email-verification/",
  emailVerification,
  validate,
  authController.sendVerificationCode
);

router.post(
  "/otp-verification/",
  otpEmailVerification,
  validate,
  authController.verifyCode
);

router.post(
  "/change-password",
  isAuthMiddleware,
  updatePasswordVerification,
  validate,
  authController.retrivePassword
);

router.post("/logout", isAuthMiddleware, authController.logout);
module.exports = router;
