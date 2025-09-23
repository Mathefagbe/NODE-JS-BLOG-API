const bcrypt = require("bcryptjs");
const AppError = require("./appError");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new AppError(error, 500);
  }
};

module.exports = hashPassword;
