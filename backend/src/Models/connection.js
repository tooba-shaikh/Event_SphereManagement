const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eve";

mongoose
  .connect(MONGO_URI)
  .then((conn) => {
    console.log(`====================================================`);
    console.log(`✅ MongoDB Direct Connection Established: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`====================================================`);
  })
  .catch((error) => {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  });

module.exports = mongoose;