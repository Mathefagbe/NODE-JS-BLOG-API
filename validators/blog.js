const { check } = require("express-validator");
const { categoryModel, tagsModel, postModel } = require("../models");
const postValidator = [
  check("title").notEmpty().withMessage("Title cannot be empty"),
  check("description").notEmpty().withMessage("Title cannot be empty"),
  check("category_id")
    .notEmpty()
    .withMessage("category id is required")
    .isUUID()
    .withMessage("category_ids must be uuid")
    .custom(async (val) => {
      const category = await categoryModel.findById(val);
      if (!category) throw new Error(`Invalid Category ID ${val}`);
      return true;
    }),

  check("tags_ids")
    .isArray()
    .withMessage("tags_ids must contain array of tags ids")
    .custom(async (vals) => {
      // const foundTags = await tagsModel.find({ _id: { $in: vals } });
      const foundTags = await tagsModel.find().where("_id").in(vals);
      if (foundTags.length !== vals.length) {
        throw new Error("One or more tag IDs are invalid");
      }
      return true;
    }),

  check("status").custom((val) => {
    const enums = ["draft", "published", "archived"];
    if (enums.includes(val)) return true;
    throw new Error("Invalid status! status include draft,published,archived");
  }),
];

const commentValidator = [
  check("comment").notEmpty().withMessage("comment must not be empty"),
];
module.exports = { postValidator, commentValidator };
