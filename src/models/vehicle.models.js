import mongoose, { Schema, model } from "mongoose";

// import mongoose from 'mongoose';

const vehicleSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleRegNo: {
    type: String,
    required: true,
    unique : true
  },
  rcPhotoUrl: {
    type: String,
    required: true
  },
  licenceNo: {
    type: String,
    required: true,
    unique :  true
  },
  licencePhotoUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Vehicle = model('Vehicle', vehicleSchema);

export default Vehicle;
