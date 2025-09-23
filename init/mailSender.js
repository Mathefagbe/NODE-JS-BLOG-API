const nodemail = require("nodemailer");
const { host_user, host_password } = require("../config/keys");

const transporter = nodemail.createTransport({
  host: "smtp.gmail.com",
  post: "587",
  secure: false,
  auth: {
    user: host_user,
    pass: host_password,
  },
});

module.exports = transporter;
