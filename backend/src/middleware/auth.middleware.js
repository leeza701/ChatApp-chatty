import jwt from "jsonwebtoken";
import User from '../models/user.models.js';
 
export const protectRoute=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt
    if(!token){
        return res.status(401).json({message:"unauthorised-No token provded"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user=await User.findById(decoded.userId).select("-password"); // .select("-password") means: get all user data except the password (for security).

    if(!user){
        return res.status(401).json({ message: " User not found" });
    }
    req.user=user
    next()

  } catch (error) {
    console.log("error in protectRoute middleware:",error.message);
    return res.status(401).json({message:"internal server error"});
  }
}