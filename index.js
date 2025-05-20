const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;

app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
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

// Connect to DB first, then start server
  app.listen(port,async () => {
    console.log(`Server is running on port ${port}`);
     await connectDB()
  });
  app.get('/', (req, res) => {
  res.send('Hello World!');
});
// create product
app.post('/products', async (req, res) => {
  const { name, price, description } = req.body;
  const product = new Product({ name, price, description });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
app.get('/products',async(req,res)=>{
    try{
        const products=await Product.find();
        if(products.length===0){
            return res.status(404).send({message:'No products found'});
        }else if(products.length>0){
            return res.status(200).send({message:'Products found',data:products});
        }
   
    }catch(err){
        res.status(500).send({message:err.message});
    }
})
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

