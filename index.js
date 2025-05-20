const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;
// create product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number || String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  }
});
// create product model
const Product = mongoose.model('Products', productSchema);
async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testProductDb', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to DB first, then start server
  app.listen(port,async () => {
    console.log(`Server is running on port ${port}`);
     await connectDB()
  });

