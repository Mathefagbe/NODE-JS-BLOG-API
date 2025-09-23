const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const { connection_url } = require("../config/keys");

const connetMongodb = async () => {
  try {
    await mongoose.connect(connection_url);
    console.log("DATABASE CONNECTED SUCCESSFULLY");
    return "done";
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connetMongodb;
