// app.js
const express = require("express");
const productRoutes = require("./routes/product.route");
const applyCommonMiddleware = require("./middleware/commonMiddleware");
const authRoutes = require('./routes/auth.route');
const app = express();
require('dotenv').config();
// Middleware
applyCommonMiddleware(app);
// Routes
app.use("/products", productRoutes);
app.use('/auth', authRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});
module.exports = app; // 👈 Export app so server.js can use it
