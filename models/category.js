const mongoose = require("mongoose");
const uuid = require("uuid");

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuid.v4() },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamp: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
