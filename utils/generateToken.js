const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const generateToken = (user) => {
  const token = jwt.sign(
    {
      user,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

module.exports = generateToken;
