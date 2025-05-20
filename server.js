// server.js
const app = require("./app");
const connectDB = require("./dbconnect/db");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB(); // ✅ DB connects before server starts
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();


