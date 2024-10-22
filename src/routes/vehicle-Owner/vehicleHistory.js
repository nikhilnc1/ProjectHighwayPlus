import express from 'express';
const router = express.Router();
import Journey from '../../models/journey.models.js'; // Assuming Journey model is in models folder

// POST route for inserting vehicle journey history
router.post('/journey', async (req, res) => {
    try {
        const {
            userId,
            vehicleId,
            startLocation,
            endLocation
        } = req.body;

        // Input validation
        if (!userId || !vehicleId || !startLocation || !endLocation) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const startTime = new Date(); // Automatically generate current date and time

        // Create a new journey record
        const newJourney = new Journey({
            userId,
            vehicleId,
            startLocation,
            endLocation,
            startTime // Store startTime here
        });

        // Save the journey record to the database
        const savedJourney = await newJourney.save();

        res.status(201).json({
            success: true,
            message: 'Journey history inserted successfully',
            journey: savedJourney
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving journey history' });
    }
});


router.put('/journey/:id/status', async (req, res) => {
    const { id } = req.params;
    const { journeyStatus } = req.body;

    // Ensure valid status
    const validStatuses = ['in_progress', 'completed', 'canceled'];
    if (!validStatuses.includes(journeyStatus)) {
        return res.status(400).json({ message: 'Invalid journey status' });
    }

    try {
        // Find the journey by ID
        const journey = await Journey.findById(id);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        // Update the status and endTime if status is 'completed'
        journey.journeyStatus = journeyStatus;

        if (journeyStatus === 'completed') {
            journey.endTime = new Date(); // Set the endTime when journey is completed
        }

        // Save the updated journey
        const updatedJourney = await journey.save();

        res.status(200).json({
            message: 'Journey status updated successfully',
            journey: updatedJourney
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating journey status' });
    }
});

export default router;