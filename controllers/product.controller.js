const Product = require("../models/product.model");

// Create product
exports.createProduct = async (req, res) => {
  const { name, price, description, rating } = req.body;
  try {
    const product = new Product({ name, price, description, rating });
    await product.save();
    res.status(201).send({ message: "Product created", data: product });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Get products (filtered or all)
exports.getProducts = async (req, res) => {
  try {
    const { price } = req.query;
    let products = [];

    if (price) {
      products = await Product.find({
        $and: [{ price: { $lte: price } }, { rating: { $gt: 3 } }],
      });
    } else {
      products = await Product.find().limit(20).sort({ createdAt: -1 });
    }

    if (!products.length) {
      return res.status(404).send({ message: "No products found" });
    }

    res.status(200).send({ message: "Products found", data: products });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("name");
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({
      message: "Product found",
      data: product,
      visitCount: req.visitCount || 0, // Include visit count
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product updated", data: product });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product deleted", data: product });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
