import mongoose from "mongoose";

const otpSchema= new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  action:{
    type:String,
    enum:['account_verify','event_booking'],
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires:300,
  }
})

const OTP=mongoose.model("OTP",otpSchema);
export default OTP