const Cart=require ("../models/cartModel");/* only id we are storing*/

const Product=require ("../models/productModel");

exports.getcart = async (req, res) => {
    const {user_id}=req.user;

    const cart=await Cart.findOne({user_id});

    if(!cart){
        res.status(400).json({message:"Cart not found"});
    }try{
        let subTotal=0;
        const CartItems=await Promise.all(
            cart.products.map(async (product)=>{
                const productDetails=await Product.findOne({id:product.product_id});
                subTotal+=productDetails.price*product.quantity;
                return{
                product_id:productDetails.id,
                title:productDetails.title,
                description:productDetails.description,
                price:productDetails.price,
                image:productDetails.image,
                quantity:product.quantity,
                
                };
            })
        );
        res.status(200).json({cartItem:CartItems,subTotal});
    }catch(err){
 res.status(500).json({message:"Server error",err});
    }
    
};

exports.deleteCart=async(req,res)=>{
    const {userId}=req.user;
    const product_id=req.params.id
    try{
let cart=await Cart.findOne({userId});
if(!cart){
    return res.status(404).json({message:"user not found"})
}
const IsProduct = cart.products.find((product)=>product.product_id === product_id);
if(!IsProduct){
    return res.json(401).json({message: "Product not found"})
}else{
if(cart.products.length<=1){
    await Cart.deleteOne({
        userId
    })
    return res.status(200).json({message:"Product deleted from cart"});
}
else{
    cart.products=cart.products.filter((pr)=>
        prod.id!=product_id
    )
    cart.save()
    return res.status(200).json({message:"Product deleted from cart"});
}
}
    }
    catch(err){
        return res.status(401).json({message:"internal server error",err})
    }
};
 

  
exports.createCart=async (req,res)=>{
    const {user_id}=req.user;
    const {product_id,quantity}=req.body;
    let cart=await Cart.findOne({user_id});/*checking cart data*/

 if(!cart){
    cart=new Cart({
    user_id,
    products:[
        {
            product_id,
            quantity,
        },
    ],
    
    });
 }else{
    const ProductIndex=cart.products.findIndex(/*if inside it will give positive number*/
        (prod)=>prod.product_id===product_id
    );


if(ProductIndex > -1){/* quantity is increased*/
    cart.products[ProductIndex].quantity=quantity;
 }else{
    cart.products.push({product_id,quantity});/*else we are pushing*/
 }
}
cart.save();
res.status(200).json({message:"Product updated/added in cart",cart});
};