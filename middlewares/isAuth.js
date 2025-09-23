const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const AppError = require("../utils/appError");

const isAuthMiddleware = (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError("Authentication token not provided", 401);
    }

    const payload = jwt.verify(token, jwtSecret);

    req.user = payload.user;
    next();
  } catch (error) {
    const message =
      error.name === "JsonWebTokenError"
        ? "Invalid token"
        : error.name === "TokenExpiredError"
        ? "Token expired"
        : error.message;
    next(new AppError(message, 401));
  }
};

module.exports = isAuthMiddleware;
