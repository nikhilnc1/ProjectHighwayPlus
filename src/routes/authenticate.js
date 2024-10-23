import express from 'express';
import User from '../models/users.models.js';  // Ensure to include '.js' in ES module imports
import twilio from 'twilio';
import Vehicle from '../models/vehicle.models.js';
import Otp from '../models/otp.models.js';
import { config } from 'dotenv';

// Load environment variables
config();

const router = express.Router();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

// Helper function to generate a random OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);  // 4-digit OTP
}

// Helper function to send OTP using Twilio
async function sendOTP(phone, otp) {
    try {
        return await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: `+91${phone}`
        });
    } catch (error) {
        console.error('Failed to send OTP via Twilio:', error.message);
        throw new Error('Failed to send OTP via Twilio');
    }
}

// Endpoint to request OTP (use POST)
router.get('/request-otp', async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    if (!/^[1-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 digits and cannot start with 0.' });
    }

    try {
        // Check if user exists, if not, create a new user
        let user = await User.findOne({ phone });
       

        // Generate OTP
        const otp = generateOTP();

        // Save OTP entry to the database
        const otpEntry = new Otp({ phone, otp });
        await otpEntry.save();

        // Send OTP to the user's phone
        await sendOTP(phone, otp);

        console.log(`OTP sent to ${phone}: ${otp}`);

        // Return success response
        return res.json({ success: true, message: "Phone number validated and OTP sent." });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
    }
});

// Endpoint to verify OTP (use POST)
router.get('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    // Validate phone number format
    if (!/^[1-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Phone number must be 10 digits and cannot start with 0.'
        });
    }

    try {
        // Find the latest OTP for the phone number
        const otpEntry = await Otp.findOne({ phone }).sort({ createdAt: -1 });

        // Check if OTP exists (or has expired)
        if (!otpEntry) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or does not exist.'
            });
        }

        // Check if the entered OTP matches the one in the database
        if (otpEntry.otp === otp) {
            await Otp.deleteOne({ _id: otpEntry._id }); // Remove OTP after successful verification

            // Check if the user is already registered
            const user = await User.findOne({ phone });
            if (user && user.name) {
                return res.status(200).json({
                    success: true,
                    isRegistered: true,
                    message: 'OTP verified. Redirect to dashboard.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    isRegistered: false,
                    message: 'OTP verified. Please provide your details.'
                });
            }
        } else {
            // If OTP is invalid
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP.'
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error.'
        });
    }
});

// Resend OTP API
router.get('/resend-otp', async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    if (!/^[1-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Phone number must be 10 digits and cannot start with 0.' });
    }

    try {
        // Check if user exists

        // Generate a new OTP
        const otp = generateOTP();

        // Save the new OTP to the database
        const otpEntry = new Otp({ phone, otp });
        await otpEntry.save();

        // Send the new OTP
        await sendOTP(phone, otp);

        console.log(`Resent OTP to ${phone}: ${otp}`);

        // Return success response
        return res.json({ success: true, message: 'OTP resent successfully.' });

    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ success: false, message: 'Failed to resend OTP. Please try again later.' });
    }
});

export default router;
