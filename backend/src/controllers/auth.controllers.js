import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js';

export const signup= async(req,res)=>{
    const{name,email,password}=req.body;
    try {
        if(!name||!email||!password){
            return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password is too short"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exist"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({name,email,password:hashedPassword});

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res)
            await newUser.save(); 
        }else{
            return res.status(400).json({message:"invalid user data"});
        }
        
        return res.status(201).json({message:newUser})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"intenal server error"});
    }
};

export const login=async(req,res)=>{
    const{email,password}=req.body;
    try {
       const user=await User.findOne({email});
       
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return res.status(400).json({message:"invalid crendential"});
        }
        generateToken(user._id,res);
        return res.status(200).json({message:user})

 
    } catch (error) {
        return res.staus(500).json({message:"internal server error"});
    }

};
export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"});
    } catch (error) {
        console.log("error in logged controller",error.message);
    }
};

export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
       const userId= req.user._id;
       if(!profilePic){
        return res.status(400).json({message:"profile pic is required"});
       }

       const uploadResposne=await cloudinary.uploader.upload(profilePic)
       const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResposne.secure_url},{new:true})


       return res.status(200).json(updateUser);

    } catch (error) {
        console.log("error in update profile:",error);
        res.status(500).json({message:"internal server error"});
    }
};
export const checkAuth=(req,res)=>{
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error.message);
        return res.staus(500).json({message:"internal server error"});
    }
}