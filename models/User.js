const mongoose = require("mongoose");
const uuid = require("uuid");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuid.v4() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6 },
    about: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
