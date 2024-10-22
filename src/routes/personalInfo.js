import express from 'express';
import User from '../models/users.models.js';  // Ensure to include '.js' in imports when using ES modules

const router = express.Router();


//use this route for create and update the personal info for user
router.post('/register', async (req, res) => {
    const { phone, userType, name, panOrAadhar } = req.body;

    try {
        // Ensure all required fields are provided
        if (!phone || !userType || !name || !panOrAadhar) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate user type
        if (!['vehicle_owner', 'regular_user'].includes(userType)) {
            return res.status(400).json({ error: 'Invalid user type provided.' });
        }

        // Validate phone number format (if you have specific validation logic)
        if (!/^[1-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ error: 'Phone number must be 10 digits and cannot start with 0.' });
        }

        // Check if user with this phone number already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this phone number already exists.' });
        }

        // Create a new user based on the provided userType
        const newUser = new User({
            phone,
            userType,
            name,
            panOrAadhar,
        });

        // Save the user
        const savedUser = await newUser.save();

        // Respond with success message
        res.status(201).json({ 
            success: true, 
            message: `${userType.replace('_', ' ')} registered successfully`, 
            user: savedUser // Return only the necessary fields of savedUser if needed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, error: 'Server error. Please try again later.' });
    }
});


export default router;
