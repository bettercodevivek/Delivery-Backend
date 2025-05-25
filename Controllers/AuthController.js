const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../Models/UserModel');

const Signup = async(req,res) => {
   try{
     const {email,username,password} = req.body;

    if(!email || !username || !password){
        return res.status(401).json({error:"All credentials are needed !"})
    }

    const newUser = new User({email,username,password,role});

    await newUser.save();

    res.status(201).json({
        message:"New User Created Successfully !",
        user:{
            username:newUser.username,
            email:newUser.email,
            role:newUser.role
        }
    })
   }
   catch(err){
     res.status(500).json({error:"Internal Server Error !"})
   }
}

const login = async(req,res) => {
   try{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(401).json({error:"Both Credentials need to be filled !"})
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({error:"This user not found !"})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({error:"Wrong Password !"})
    }

    const payLoad = {
        userId:user._id,
        username:user.username,
        email:user.email
    }

    const AccessToken = jwt.sign(payLoad,process.env.ACCESS_SECRET_KEY,{expiresIn:"2m"});

    const RefreshToken = jwt.sign(payLoad,process.env.REFRESH_SECRET_KEY,{expiresIn:"7d"});

    res.cookie('RefreshToken',RefreshToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    res.status(200).json({
        message:"login successful",
        token:AccessToken
    })
   }
   catch(err){
    res.status(500).json({error:"Internal Server Error !"})
   }

}

module.exports = {Signup,login};