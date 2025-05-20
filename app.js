// app.js
const express = require("express");
const productRoutes = require("./routes/product.route");
const app = express();

// Middleware
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = app; // 👈 Export app so server.js can use it
