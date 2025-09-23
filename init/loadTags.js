const { tagsModel } = require("../models");
const slugify = require("slugify");
const blogTags = require("../constant/tags");

const initializeTags = async () => {
  try {
    let bulkTag = [];
    for (const element of blogTags) {
      const slug = slugify(element, { lower: true });
      const itExist = await tagsModel.findOne({ slug });

      if (!itExist) {
        bulkTag.push(
          new tagsModel({
            title: element,
            slug,
          })
        );
      }
    }

    if (bulkTag.length > 0) {
      await tagsModel.bulkSave(bulkTag);
      console.log("tags saved");
    } else {
      console.log("No new tag to save");
    }
  } catch (error) {
    console.error("Error initializing tag:", error);
  }
};

module.exports = initializeTags;
