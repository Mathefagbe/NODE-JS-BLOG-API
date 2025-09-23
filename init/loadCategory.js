const { categoryModel } = require("../models");
const slugify = require("slugify");
const blogCategories = require("../constant/category");

const initializeCategory = async () => {
  try {
    let bulkCategory = [];

    for (const element of blogCategories) {
      const slug = slugify(element, { lower: true });
      const itExist = await categoryModel.findOne({ slug });

      if (!itExist) {
        bulkCategory.push(
          new categoryModel({
            title: element,
            slug,
          })
        );
      }
    }

    if (bulkCategory.length > 0) {
      await categoryModel.bulkSave(bulkCategory);
      console.log("Categories saved");
    } else {
      console.log("No new categories to save");
    }
  } catch (error) {
    console.error("Error initializing categories:", error);
  }
};

module.exports = initializeCategory;
