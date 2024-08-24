const mongoose = require("mongoose");
require("dotenv").config();

const { DB_NAME } = process.env;
const connect = async () => {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(`mongodb://localhost/${DB_NAME}`);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(`Error connectiong to MongoDB: ${e.message}`);
  }
};

module.exports = connect;
