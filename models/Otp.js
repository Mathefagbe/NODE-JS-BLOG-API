const mongoose = require("mongoose");
const uuid = require("uuid");

const otpSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuid.v4() },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiredAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30mintues
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.model("Otp", otpSchema);

module.exports = otpModel;
