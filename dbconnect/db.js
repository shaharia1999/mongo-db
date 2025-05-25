// const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/testProductDb");
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDb");
    console.log("MongoDB connected successfully");

    // Drop the problematic index
    const indexes = await mongoose.connection.collection('products').indexes();
    const hasNameIndex = indexes.find(index => index.name === 'name_1');

    if (hasNameIndex) {
      await mongoose.connection.collection('products').dropIndex('name_1');
      console.log("Dropped index: name_1");
    } else {
      console.log("No index named 'name_1' found.");
    }

  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

