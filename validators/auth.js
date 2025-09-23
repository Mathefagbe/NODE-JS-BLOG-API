const { check } = require("express-validator");

const signUpValidator = [
  check("firstName").notEmpty().withMessage("firstName is Required"),
  check("lastName").notEmpty().withMessage("firstName is Required"),
  check("email")
    .normalizeEmail()
    .trim("@")
    .isEmail()
    .withMessage("please enter a valid email address")
    .notEmpty()
    .withMessage("email is required"),
  check("password")
    .isStrongPassword()
    .withMessage("Please enter a strong password")
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 characters"),
  check("about"),
];

const signInValidator = [
  check("email")
    .normalizeEmail()
    .trim("@")
    .isEmail()
    .withMessage("email must be a valid email")
    .notEmpty()
    .withMessage("email is required"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 characters"),
];
const emailVerification = [
  check("email")
    .normalizeEmail()
    .trim("@")
    .isEmail()
    .withMessage("email must be a valid email")
    .notEmpty()
    .withMessage("email is required"),
];
const otpEmailVerification = [
  check("email")
    .normalizeEmail()
    .trim("@")
    .isEmail()
    .withMessage("email must be a valid email")
    .notEmpty()
    .withMessage("email is required"),
  check("otp").notEmpty().withMessage("otp is required"),
];

const updatePasswordVerification = [
  check("old_password")
    .notEmpty()
    .withMessage("old password is required")
    .isLength({ min: 6 })
    .withMessage("A min of 6 length is required"),
  check("new_password")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("A min of 6 length is required"),
];

module.exports = {
  signUpValidator,
  signInValidator,
  emailVerification,
  otpEmailVerification,
  updatePasswordVerification,
};
