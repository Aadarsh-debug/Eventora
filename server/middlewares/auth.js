import jwt from "jsonwebtoken"
import User from "../models/User.js" 

const protect=async(req,res,next)=>{
   const token=req.headers.authorization && req.headers.authorization.split(" ")[1];
   if(token){
     try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      req.user=await User.findById(decoded.id).select('-password');
      if(!req.user) return res.status(401).json({message:"Not authorized. User not found"})
      next();
    }catch(error){
      console.log("Not authorized",error);  
    }
   }else{
    return res.status(401).json({message:"Not authorized no token"})   
   }

}

const admin=(req,res,next)=>{
  if(req.user&& req.user.role=='admin') next();
  else return res.status(401).json({message:"forbidden Access only admin can access"})
}

export { protect, admin };