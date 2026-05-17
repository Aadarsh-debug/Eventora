import User from "../models/User.js"
import bcrypt from "bcrypt"
import OTP from "../models/OTP.js"
import emailService from "../utils/email.js"
import jwt from "jsonwebtoken"

const generateWebToken=(id,role)=>{
  return jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:'7d'})
};


export const signupUser=async(req,res)=>{
  try {
  const {name,email,password}=req.body
  if(!name||!email||!password) return res.status(400).json({error:"all fields are required"})
  let userExist = await User.findOne({email})
  if(userExist)return res.status(400).json({error:"User already exist"})
  const genSalt =await bcrypt.genSalt(12)
  const hashedPassword= await bcrypt.hash(password,genSalt);
  const user = await User.create({name:name,
    email:email,
    password:hashedPassword,
    role:'user',
    isVerified:false
  });
  
  const otp=Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.create({email,otp:otp,action:'account_verify'})
  await emailService.sendOtpEmail(email,otp,"account_verify");
  res.status(201).json({message:"user registered successfully. please check your mail for otp to verify",email:user.email})
  
  
} catch (error) {
  res.status(400).json({message:error.message}); 
}
}
export const loginUser=async(req,res)=>{
  try {
  const {email,password}=req.body;
  if(!email||!password) return res.status(400).json({message:"All fields are required"});
  const user=await User.findOne({email});
  if(!user) return res.status(400).json({message:"User does not exist"});
  const comparepass=await bcrypt.compare(password,user.password);
  if(!comparepass) return res.status(400).json({message:"Invalid Credential"});

  if(!user.isVerified&& user.role !=='admin'){
    const otp=Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndDelete({email:user.email,action:'account_verify'});
    await OTP.create({email:user.email,otp:otp,action:'account_verify'});
    await emailService.sendOtpEmail(email,otp,'account_verify');
    return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
  }
  res.json({
    _id:user._id,
    name:user.name,
    email:user.email,
    role:user.role,
    token:generateWebToken(user.id,user.role)
  })

  
} catch (error) {
  console.log("error in login",error);  
}
}


export const verifyOTP=async(req,res)=>{
try {
  const {email,otp}=req.body;
  const otpRecord=await OTP.findOne({email,otp,action:'account_verify'});
  if(!otpRecord) return res.status(400).json({message:"invalid or expired otp"})
  const user=await User.findOneAndUpdate({email},{isVerified:true});
  await OTP.deleteMany({email,action:'account_verify'})
  res.json({
    message:"Account verification successfull. You can now log in",
    _id:user._id,
    name:user.name,
    email:user.email,
    role:user.role,
    token:generateWebToken(user._id, user.role)
  })
 
} catch (error) {
  console.log("error in verifyOtp",error); 
}
}
