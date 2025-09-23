const { user, otpModel } = require("../models");
const AppError = require("../utils/appError");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateOtpCode = require("../utils/generateOtpCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    //check if email already exist of not
    const email = await user.findOne({ email: req.body.email });
    if (email) throw new AppError("Email already exist", 404);

    req.body.password = await hashPassword(req.body.password);
    const newUser = new user(req.body);
    const savedUserObj = (await newUser.save()).toObject();

    delete savedUserObj.password;

    return res.status(201).json({
      code: 201,
      message: "User created successfully",
      data: savedUserObj,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userEmail = await user.findOne({ email });

    if (!userEmail)
      throw new AppError("invalid credential,Please check your email", 401);

    const match = await comparePassword(password, userEmail.password);

    if (!match)
      throw new AppError("invalid credential,Please check your password", 401);

    const token = generateToken(userEmail);

    const savedUserObj = userEmail.toObject();
    delete savedUserObj.password;
    savedUserObj["token"] = token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, //depending on production or staging
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.status(201).json({
      code: 201,
      message: "login successfull",
      data: savedUserObj,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const code = generateOtpCode();
    let sendCode = null;

    const hasEmail = await user.findOne({ email });
    if (!hasEmail)
      throw new AppError("wrong email,please check the email", 400);

    const expiryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    sendCode = await otpModel.findOneAndUpdate(
      { email },
      { otp: code, expiredAt: expiryTime },
      { upsert: true, new: true }
    );

    sendEmail({
      emailTo: email,
      subject: "Verification Code",
      templateName: "../templates/otp.ejs",
      content: {
        name: hasEmail.firstName,
        otp: sendCode.otp,
        expiryMinutes: Math.ceil(
          (sendCode.expiredAt.getTime() - Date.now()) / 60000
        ),
      },
    })
      .then(() => console.log("EMAIL SENT SUCCESSFULL"))
      .catch((error) => {
        next(error);
      });

    console.log("before sent");
    return res.status(201).json({
      status: "success",
      message: `Verification code sent ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const match = await otpModel.findOne({ email, otp });

    if (!match) throw new AppError("otp provided is wrong,please check", 400);

    //check if it has expire or not
    if (Date.now() > match.expiredAt)
      throw new AppError("Otp has expired", 400);

    const getuser = await user.findOne({ email });
    getuser.isVerified = true;

    //update the user verification status
    await getuser.save();

    // //delete the otp created for that user
    await match.deleteOne();

    return res.status(200).json({
      code: 200,
      message: "User verified successfully",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {};

const retrivePassword = async (req, res, next) => {
  try {
    const { new_password, old_password } = req.body;
    if (!new_password || !old_password)
      throw new AppError("Both old and new passwords are required", 400);

    // Fetch full user from DB
    const getUser = await user.findById(req.user._id);
    if (!getUser) throw new AppError("User not found", 404);

    const match = await comparePassword(old_password, req.user.password);
    if (!match) throw new AppError("Your old password is incorrect", 400);

    getUser.password = await hashPassword(new_password);
    await getUser.save();
    user_response = getUser.toObject();
    delete user_response.password;
    return res.status(201).json({
      status: "success",
      data: user_response,
      message: `Updated Successfully `,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(201).json({
      status: "success",
      message: `logout successful`,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
module.exports = {
  signup,
  login,
  forgetPassword,
  retrivePassword,
  sendVerificationCode,
  verifyCode,
  logout,
};
