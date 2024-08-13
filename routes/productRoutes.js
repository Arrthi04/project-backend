const ProductController =require('../controllers/productController')
const express=require('express');
const router=express.Router();

router.get("/",ProductController.getProducts)
router.post("/",ProductController.createProduct)
// router.get('/products',()=>{

// })

module.exports=router