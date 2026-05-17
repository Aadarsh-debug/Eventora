import express from "express"
import { protect,admin } from "../middlewares/auth.js";
import { bookevent,sendBookingOtp,mybooking,confirmBooking,cancelBooking } from "../controllers/booking.controller.js";
const router=express.Router();


router.post('/',protect,bookevent);
router.post('/send-otp',protect,sendBookingOtp);
router.get('/my',protect,mybooking);
router.put('/:id/confirm',protect,admin,confirmBooking);
router.delete('/:id',protect,cancelBooking);

export default router