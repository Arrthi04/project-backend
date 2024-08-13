const mongoose=require('mongoose');

const  CartSchema=new mongoose.Schema({
    user_id:String,
    products:[
        {
            product_id:String,
            quantity:Number,
        },
    ],

});

const Cart =mongoose.model("Cart",CartSchema);

module.exports=Cart;
