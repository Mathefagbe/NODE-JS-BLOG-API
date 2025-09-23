const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

//middleware
const validate = (req, res, next) => {
  const error = validationResult(req);
  const mappedError = {};
  if (Object.keys(error.errors).length === 0) {
    next();
  } else {
    error.errors.map((e) => {
      mappedError["err"] = `${e.path}: ${e.msg}`;
      throw new AppError(mappedError.err, 400);
    });
  }
};

module.exports = validate;
