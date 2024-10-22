import mongoose from "mongoose";

const JourneySchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    vehicleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Vehicle', 
      required: true 
    },
    startLocation: {
      type: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
      },
      required: true
    },
    endLocation: {
      type: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
      },
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      default: null // End time is optional and null initially
    },
    journeyStatus: {
      type: String,
      enum: ['in_progress', 'completed', 'canceled'],
      default: 'in_progress'
    }
  }, { timestamps: true });
  
  const Journey = mongoose.model('Journey', JourneySchema);
  
export default Journey;
  