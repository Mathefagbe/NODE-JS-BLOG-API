const errorHandler = (error, req, res, next) => {
  error.code = error.statusCode ? error.statusCode : 500;
  res.status(error.code).json({
    message: error.message,
    code: error.code,
    status: "failed",
  });
};

module.exports = errorHandler;
