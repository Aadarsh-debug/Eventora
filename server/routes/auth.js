import express from "express";
import {signupUser,loginUser,verifyOTP} from "../controllers/auth.controller.js"


const router=express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/verifyOTP",verifyOTP);
export default router