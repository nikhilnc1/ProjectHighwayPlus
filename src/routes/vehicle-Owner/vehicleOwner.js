import express from 'express';
import User from '../../models/users.models.js';  // Ensure to include '.js' in imports when using ES modules
import Vehicle from '../../models/vehicle.models.js';

const router = express.Router();

router.post("/add-vehicle-info", async function (req, res) {
    const { phone, vehicles } = req.body;

    try {
        // Validate that vehicles are provided
        if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
            return res.status(400).json({success: false, message: "Vehicles information is required." });
        }

        // Find the user by phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const vehicleIds = [];
        
        // Iterate over the vehicles array and save each vehicle to the database
        for (const vehicle of vehicles) {
            const newVehicle = new Vehicle({
                owner: user._id,
                vehicleRegNo: vehicle.vehicleRegNo,
                rcPhotoUrl: vehicle.rcPhotoUrl,
                licenceNo: vehicle.licenceNo,
                licencePhotoUrl: vehicle.licencePhotoUrl
            });
            const savedVehicle = await newVehicle.save();
            vehicleIds.push(savedVehicle._id);
        }

        // Append new vehicle IDs to the user's vehicleDetails array
        user.vehicleDetails = user.vehicleDetails.concat(vehicleIds);

        // Save the updated user with the appended vehicle details
        await user.save();

        res.status(201).json({ 
            success: true, 
            message: 'Vehicles registered successfully', 
            user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to register vehicles. Please try again." });
    }
});


router.get("/show-vehicles/:phone", async function(req, res){

    const { phone } = req.params;
    try {
        const user = await User.findOne({ phone }).populate('vehicleDetails');

        if(!user)
        {
            return res.status(404).json({success : false, message : "User not found"});
        }

        if(user.vehicleDetails.length == 0)
        {
            return res.status(404).json({success:false, message : "Vehicle not found"});
        }

        res.status(200).json({
            success :  true,
            message : "Vehicle data retrive successfully",
            vehicles : user.vehicleDetails
        })

    } catch (error) {
        res.status(500).json({error : err.message});
    }
})

router.put("/vehicle-update/:vehicleId", async function (req, res) {
    const { vehicleId } = req.params;
    const { vehicleRegNo, rcPhotoUrl, licenceNo, licencePhotoUrl } = req.body;

    try {
        // Find the vehicle by ID
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found." });
        }

        // Update vehicle details with new data
        if (vehicleRegNo) vehicle.vehicleRegNo = vehicleRegNo;
        if (rcPhotoUrl) vehicle.rcPhotoUrl = rcPhotoUrl;
        if (licenceNo) vehicle.licenceNo = licenceNo;
        if (licencePhotoUrl) vehicle.licencePhotoUrl = licencePhotoUrl;

        // Save the updated vehicle
        const updatedVehicle = await vehicle.save();

        // Respond with the updated vehicle information
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            vehicle: updatedVehicle
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/vehicle-delete/:vehicleId", async function(req, res){
    const { vehicleId } = req.params;

    try {
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);

        if(!vehicle)
        {
            res.status(404).json({
                success : false,
                message : "Vehicle not found"
            })
        }

        //update the information in user collection
        const user = await User.findById(vehicle.owner);
        if(user){
            user.vehicleDetails = user.vehicleDetails.filter(
                function(id){id.toString() !== vehicleId}     
            )
            await user.save();// save the user with updated vehicles
        }

        res.status(200).json({success : true,message : "vehicle deleted successfully"});


    } catch (err) {
        res.status(500).json({
            success : false,
            error : err.message
        })
    }
});



export default router;