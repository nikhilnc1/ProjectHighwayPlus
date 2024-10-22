import mongoose, { Schema, model } from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: '300s' } // 5 minutes expiration
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp
