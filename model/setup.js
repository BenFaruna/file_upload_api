const mongoose = require("mongoose");

async function connectDB() {
    const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/test"
    // console.log(DB_URL)
    await mongoose.connect(DB_URL)
}

connectDB().catch(err => console.log(err));

module.exports = mongoose;