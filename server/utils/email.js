import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const createTransporter = ({ port, secure }) => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port,
  secure,
  requireTLS: !secure,
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

const sendMail = async (mailOptions) => {
  const primaryPort = Number(process.env.EMAIL_PORT) || 587;
  const primarySecure = process.env.EMAIL_SECURE === "true" || primaryPort === 465;
  const fallbackPort = primaryPort === 465 ? 587 : 465;
  const fallbackSecure = fallbackPort === 465;

  try {
    return await createTransporter({
      port: primaryPort,
      secure: primarySecure
    }).sendMail(mailOptions);
  } catch (error) {
    console.error(`Primary SMTP send failed on port ${primaryPort}:`, error.message);

    return await createTransporter({
      port: fallbackPort,
      secure: fallbackSecure
    }).sendMail(mailOptions);
  }
};

const sendBookingEmail=async(userEmail,userName,eventTitle)=>{
try {
  const mailOptions={
    from:process.env.EMAIL_USER,
    to:userEmail,
    subject:`Booking Confirmed:${eventTitle}`,
    html:`<h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>`
  };
  await sendMail(mailOptions);
  console.log('Email sent successfully to', userEmail);
} catch (error) {
   console.error('Error sending email:', error);
   throw error;
}
};

const sendOtpEmail=async(userEmail,otp,type)=>{
  try {
    const title =type==='account_verify'? 'Verify your Eventora Account' : 'Eventora Booking Verification';
    const mssg=type === 'account_verify'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';
    const mailOptions={
      from:process.env.EMAIL_USER,
      to:userEmail,
      subject:title,
      html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${mssg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
    };
    await sendMail(mailOptions);
    console.log(`OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export default {sendBookingEmail,sendOtpEmail};
