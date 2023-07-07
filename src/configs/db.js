const mongoose = require("mongoose");

const URI = "mongodb://0.0.0.0:27017/instagram";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(URI);
    console.log("DB Connected Successfully ✅");
  } catch (e) {
    console.log(`Authentication to database failed ❗`+e.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
