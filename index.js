const express =  require("express");
const productRoutes=require("./routes/productRoutes")
const userRoutes=require("./routes/userRoutes")
const cartRoutes=require("./routes/cartRoutes")
const app=express();
const cors=require ("cors");
app.use(cors());

const mongoose=require('mongoose');
app.use(express.json());
mongoose.connect(
    "mongodb+srv://arrthim1012:arrthim@cluster0.9aniylt.mongodb.net/watch"
).then(()=>{
    console.log("connected to database");
})
app.use("/products",productRoutes);
app.use("/user",userRoutes);
app.use("/cart",cartRoutes);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
