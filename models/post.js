const mongoose = require("mongoose");
const uuid = require("uuid");

const PostSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuid.v4() },
    author: {
      type: String,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      ref: "Category",
      required: false,
    },
    tags: [
      {
        type: String,
        ref: "Tag",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", PostSchema);

module.exports = postModel;
