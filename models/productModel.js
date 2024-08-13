const mongoose=require('mongoose')

const productschema=new mongoose.Schema({
    id:String,
    brand:String,
    model:String,
    price:Number,
    image:String,
    rating:{
        rate:Number,
        count:Number
    }
})

const Product=new mongoose.model('Product',productschema)
module.exports=Product;