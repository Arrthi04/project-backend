const User= require("../models/userModel")
const bcrypt= require("bcrypt")
const jwt=require('jsonwebtoken')

exports.login = async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user =await User.findOne({email});
        if(!user){
          return res.status(400).json("Invalid Email or Password")
        }
      const isMatch=await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.status(400).json("Invalid Email or Password")
      }
      const token=jwt.sign({user_id:user._id,user_email:user.email},"secret_token",{expiresIn:"1h",});
      res.status(200).json(token);
    }catch(err){
        console.error(err)
    }
}
exports.createUser = async(req,res)=>{
    const{username,email,password} = req.body;
    const user = new User({
        username,
        email,
        password
        
    })
    await user.save();
    res.status(200).json("User created successfully");
};

