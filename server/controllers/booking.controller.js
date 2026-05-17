import Booking from "../models/Bookings.js"
import { protect,admin } from "../middlewares/auth.js"
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import emailService from "../utils/email.js"

const generateOtp=()=>{
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendBookingOtp=async(req,res)=>{
  try {

  const otp=generateOtp();
  await OTP.findOneAndDelete({email:req.user.email,otp,action:"event_booking"});
  await OTP.create({email: req.user.email, otp, action: 'event_booking'})
  await emailService.sendOtpEmail(req.user.email,otp,'event_booking')
  res.json({ message: 'OTP sent successfully'})
  
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
}
export const bookevent = async (req, res) => {
  try {

    const { event_id, otp } = req.body;

    const validOtp = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking"
    });

    if (!validOtp) {
      return res.status(400).json({
        message: 'Invalid or expired OTP for booking'
      });
    }

    const event = await Event.findById(event_id);

    if (!event) {
      return res.status(400).json({
        message: 'Event does not exist'
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: 'Seats Full'
      });
    }

    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      eventId: event_id
    });

    if (
      existingBooking &&
      existingBooking.status !== 'cancelled'
    ) {
      return res.status(400).json({
        message: 'Already Booked or pending'
      });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      eventId: event_id,
      status: 'pending',
      paymentStatus: 'not_paid',
      amount: event.ticketPrice
    });

    await OTP.deleteOne({
      _id: validOtp._id
    });

    res.status(201).json({
      message: 'Booking request submitted',
      booking: {
        _id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
}

export const confirmBooking=async(req,res)=>{
   try {
        const { paymentStatus } = req.body; // 'paid' or 'not_paid'
        const booking = await Booking.findById(req.params.id).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking is already confirmed' });

        const event = await Event.findById(booking.eventId._id);
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available to confirm this booking' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        event.availableSeats -= 1;
        await event.save();
        await emailService.sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);

        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
export const mybooking=async(req,res)=>{
  try {
    const bookings= req.user.role==='admin'?
    await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 }):
    await Booking.find({userId:req.user.id}).populate('eventId').sort({ createdAt: -1 });
    res.json({bookings})
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}
export const cancelBooking=async(req,res)=>{
  try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}