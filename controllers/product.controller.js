const Product = require("../models/product.model");
const slugify = require('slugify');

// Create product
// exports.createProduct = async (req, res) => {
//   const { name, price, description, rating } = req.body;
//   try {
//     const product = new Product({ name, price, description, rating });
//     await product.save();
//     res.status(201).send({ message: "Product created", data: product });
//   } catch (err) {
//     res.status(400).send({ message: err.message });
//   }
// };

 // to auto-generate the slug
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discount,
      stock,
      mainImage,
      images,
      filters, // { size: [...], color: [...] }
    } = req.body;

    // Basic validation
    if (!title || !category || !price || !stock || !mainImage) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const slug = slugify(title, { lower: true, strict: true });

    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'A product with this title already exists.' });
    }
    const newProduct = new Product({
      title,
      slug,
      description,
      category,
      price,
      discount,
      stock,
      mainImage,
      images,
      filters,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully.',
      product: savedProduct,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get products (filtered or all)
// exports.getProducts = async (req, res) => {
//   try {
//     const { price } = req.query;
//     let products = [];

//     if (price) {
//       products = await Product.find({
//         $and: [{ price: { $lte: price } }, { rating: { $gt: 3 } }],
//       });
//     } else {
//       products = await Product.find().limit(20).sort({ createdAt: -1 });
//     }

//     if (!products.length) {
//       return res.status(404).send({ message: "No products found" });
//     }

//     res.status(200).send({ message: "Products found", data: products });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };
// search=nike&category=Shoes&size=10&color=black&priceMin=50&priceMax=200&createdAfter=2024-01-01&createdBefore=2025-12-31&sortBy=price&sortOrder=asc&page=1&limit=10
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      color,
      size,
      priceMin,
      priceMax,
      createdAfter,
      createdBefore,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category, Color, Size
    if (category) filter.category = category;
    if (color) filter['filters.color'] = color;
    if (size) filter['filters.size'] = size;

    // Price Range
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Created Date
    if (createdAfter || createdBefore) {
      filter.createdAt = {};
      if (createdAfter) filter.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) filter.createdAt.$lte = new Date(createdBefore);
    }

    const skip = (Math.max(Number(page), 1) - 1) * Math.max(Number(limit), 1);
    const sortOption = {};
    sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const productsRaw = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    // 💡 Add discounted price in response
    const products = productsRaw.map((product) => {
      const discountAmount = (product.price * product.discount) / 100;
      const discountedPrice = product.price - discountAmount;

      return {
        ...product.toObject(),
        discountedPrice: Math.round(discountedPrice * 100) / 100, // rounded to 2 decimals
        originalPrice: product.price,
      };
    });

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
