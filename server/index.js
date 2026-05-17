import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth.js"
import event from "./routes/event.js"
import booking from "./routes/booking.js"
dotenv.config();

const app= express();
app.use(cors());
app.use(express.json())

const PORT=process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("connceted mongo");
})
app.use('/api/auth',auth);
app.use('/api/events',event);
app.use('/api/bookings',booking)


app.listen(PORT,()=>{
  console.log(`server running on ${PORT}` );
  
})
