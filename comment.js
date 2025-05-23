const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 5000;

app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
// create product schema

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    matchMedia: 100,
    trim: [true,'Name should not exceed 100 characters'],
    unique: true,
    required: [true, "Name is required"],
    // enum:["laptop", "mobile", "tablet"],
    // enum means the value of name should be one of the values in the array
   validation:{
    validator: function (v) {
     return /^[a-zA-Z0-9_ ]+$/.test(v);

    },
    message: (props) => `${props.value} is not a valid name!`,
   }
  },
  price: {
    type: Number || String,
    required: true,
  },
  rating:{
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// create product model
const Product = mongoose.model("Products", productSchema);
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDb", {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Connect to DB first, then start server

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// create product
app.post("/products", async (req, res) => {
  const { name, price, description,rating } = req.body;
  const product = new Product({ name, price, description ,rating});
  try {
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
// get all products
// compare price with 59000 $gt, $lt, $gte, $lte ,$eq, $ne, $in, $nin, $exists, $regex, $where, $mod, $all, $elemMatch, $size.
// logial operators $and, $or, $not, $nor {$and:[{price:{$lt:60000}},{name:/^a/}]}
//  count =countDocuments() after the find
//  sort = sort({price:1}) 1 for ascending and -1 for descending
//  limit = limit(10) to limit the number of documents returned
//  skip = skip(10) to skip the first 10 documents
//  projection = select({name:1,price:1}) to select only the name and price fields

app.get("/products", async (req, res) => {
  try {
    const price = req.query.price;
    // const products = await Product.find().limit(20).sort({ createdAt: -1 });
    // const products = await Product.find({price:{$lt:60000}});
    // const products = await Product.find({ price: { $lt: price } });
    const products = await Product.find({$and:[{price:{$lte:price}},{rating:{$gt:3}}]});
    if (price) {
      if (products.length === 0) {
        return res.status(404).send({ message: "No products found" });
      } else if (products.length > 0) {
        return res
          .status(200)
          .send({ message: "Products found", data: products });
      } 
    }
    else if (products) {
        const products = await Product.find().limit(20).sort({ createdAt: -1 });
        return res
          .status(200)
          .send({ message: "Products found", data: products });
      }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
// get product by id
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.find({ _id: id }, { name: 1 });
    // const product = await Product.findById(id).select({name:1});
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    } else {
      return res.status(200).send({ message: "Product found", data: product });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
// update product
app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );
    if (product) {
      return res
        .status(200)
        .send({ message: "Product updated successfully", data: product });
    } else if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      return res
        .status(200)
        .send({ message: "Product deleted successfully", data: product });
    } else if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
app.use((req, res, ) => {
  res.send("<h1>404 Not Found</h1>");
  res.status(404).send({ message: "Not Found" });
}
)
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
// app.post('./products',async(req,res)=>{
// const {name,price,description}=req.body;
// const product=new Product({name,price,description});
// try{
//     await product.save();
//     res.status(201).send({message:'product added successfully',data:product});
// }catch(err){
//     res.status(400).send({massage:err.message})
// }
// })
