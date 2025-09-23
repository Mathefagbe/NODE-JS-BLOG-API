const mongoose = require("mongoose");
const uuid = require("uuid");

const commentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4(),
      required: true,
    },
    author: {
      ref: "User",
      type: String,
      required: true,
    },
    post: {
      ref: "Post",
      type: String,
      required: true,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
