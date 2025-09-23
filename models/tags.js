const mongoose = require("mongoose");
const uuid = require("uuid");

const tagSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

const tagsModel = mongoose.model("Tag", tagSchema);

module.exports = tagsModel;
