const nodemail = require("nodemailer");
const AppError = require("./appError");
const ejs = require("ejs");
const path = require("path");
const transporter = require("../init/mailSender");

const sendEmail = async ({ emailTo, subject, content, templateName }) => {
  try {
    const templatePath = path.join(__dirname, templateName);
    const html = await ejs.renderFile(templatePath, content);
    const message = {
      to: emailTo,
      subject: subject,
      html: html,
    };
    await transporter.sendMail(message);
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

module.exports = sendEmail;
