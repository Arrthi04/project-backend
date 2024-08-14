// const Cart=require ("../models/cartModel");/* only id we are storing*/

// const Product=require ("../models/productModel");

// exports.getcart = async (req, res) => {
//     const {user_id}=req.user;

//     const cart=await Cart.findOne({user_id});

//     if(!cart){
//         res.status(400).json({message:"Cart not found"});
//     }try{
//         let subTotal=0;
//         const CartItems=await Promise.all(
//             cart.products.map(async (product)=>{
//                 const productDetails=await Product.findOne({id:product.product_id});
//                 subTotal+=productDetails.price*product.quantity;
//                 return{
//                 product_id:productDetails.id,
//                 title:productDetails.title,
//                 description:productDetails.description,
//                 price:productDetails.price,
//                 image:productDetails.image,
//                 quantity:product.quantity,
                
//                 };
//             })
//         );
//         res.status(200).json({cartItem:CartItems,subTotal});
//     }catch(err){
//  res.status(500).json({message:"Server error",err});
//     }
    
// };

// exports.deleteCart=async(req,res)=>{
//     const {userId}=req.user;
//     const product_id=req.params.id
//     try{
// let cart=await Cart.findOne({userId});
// if(!cart){
//     return res.status(404).json({message:"user not found"})
// }
// const IsProduct = cart.products.find((product)=>product.product_id === product_id);
// if(!IsProduct){
//     return res.json(401).json({message: "Product not found"})
// }else{
// if(cart.products.length<=1){
//     await Cart.deleteOne({
//         userId
//     })
//     return res.status(200).json({message:"Product deleted from cart"});
// }
// else{
//     cart.products=cart.products.filter((pr)=>
//         prod.id!=product_id
//     )
//     cart.save()
//     return res.status(200).json({message:"Product deleted from cart"});
// }
// }
//     }
//     catch(err){
//         return res.status(401).json({message:"internal server error",err})
//     }
// };
 

  
// exports.createCart=async (req,res)=>{
//     const {user_id}=req.user;
//     const {product_id,quantity}=req.body;
//     let cart=await Cart.findOne({user_id});/*checking cart data*/

//  if(!cart){
//     cart=new Cart({
//     user_id,
//     products:[
//         {
//             product_id,
//             quantity,
//         },
//     ],
    
//     });
//  }else{
//     const ProductIndex=cart.products.findIndex(/*if inside it will give positive number*/
//         (prod)=>prod.product_id===product_id
//     );


// if(ProductIndex > -1){/* quantity is increased*/
//     cart.products[ProductIndex].quantity=quantity;
//  }else{
//     cart.products.push({product_id,quantity});/*else we are pushing*/
//  }
// }
// cart.save();
// res.status(200).json({message:"Product updated/added in cart",cart});
// };


// Import required models and dependencies
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add or update an item in the cart
exports.createCart = async (req, res) => {
    const { user_id } = req.user; // Extract user ID from the token
    const { product_id, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            // Create a new cart if one does not exist
            cart = new Cart({
                user_id,
                products: [{ product_id, quantity }],
            });
        } else {
            // Update the cart if it exists
            const productIndex = cart.products.findIndex(prod => prod.product_id === product_id);

            if (productIndex > -1) {
                // Updating the quantity if the product is already in the cart
                cart.products[productIndex].quantity = quantity;
            } else {
                // Adding a new product to the cart
                cart.products.push({ product_id, quantity });
            }
        }

        await cart.save(); // Save changes to the cart
        res.status(200).json({ message: "Product updated/added in cart", cart });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ message: "Internal server error", err });
    }
};

// exports.deleteCart = async (req, res) => {
//     const { user_id } = req.user; 
//     const { product_id } = req.params; 

//     try {
//         let cart = await Cart.findOne({ user_id });

//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }

//         const productIndex = cart.products.findIndex(prod => prod.product_id === product_id);

//         if (productIndex === -1) {
//             return res.status(404).json({ message: "Product not found in cart" });
//         }

//         // Remove the product from the cart
//         cart.products.splice(productIndex, 1);

//         if (cart.products.length === 0) {
//             // Delete the cart if no products are left
//             await Cart.deleteOne({ user_id });
//             return res.status(200).json({ message: "Cart is empty and has been deleted" });
//         } else {
//             await cart.save(); // Save changes to the cart
//             res.status(200).json({ message: "Product removed from cart", cart });
//         }
//     } catch (err) {
//         console.error("Error removing from cart:", err);
//         res.status(500).json({ message: "Internal server error", err });
//     }
// };
// Delete a Product from Cart
exports.deleteCart = async (req, res) => {
    const { user_id } = req.user;
    const product_id = req.params.id;

    try {
        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            return res.status(404).json({ message: "User not found" });
        }

        const IsProduct = cart.products.find((product) => product.product_id === product_id);

        if (!IsProduct) {
            return res.status(401).json({ message: "Product not found" });
        }

        if (cart.products.length <= 1) {
            await Cart.deleteOne({ user_id });
            return res.status(200).json({ message: "Product deleted from cart" });
        } else {
            cart.products = cart.products.filter((pr) => pr.product_id !== product_id);
            await cart.save();
            return res.status(200).json({ message: "Product deleted from cart" });
        }
    } catch (err) {
        console.error("Error in deleteCart:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

exports.getcart = async (req, res) => {
    const { user_id } = req.user; // Extract user ID from the token

    try {
        const cart = await Cart.findOne({ user_id }).populate('products.product_id'); // Populate product details

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let subTotal = 0;
        const cartItems = cart.products.map(product => {
            const productDetails = product.product_id;
            subTotal += productDetails.price * product.quantity;

            return {
                product_id: productDetails.id,
                title: productDetails.title,
                description: productDetails.description,
                price: productDetails.price,
                image: productDetails.image,
                quantity: product.quantity,
            };
        });

        res.status(200).json({ cartItems, subTotal });
    } catch (err) {
        console.error("Error retrieving cart:", err);
        res.status(500).json({ message: "Internal server error", err });
    }
};
