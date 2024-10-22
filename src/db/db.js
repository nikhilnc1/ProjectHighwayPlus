

import mongoose, { connect } from 'mongoose';

// MongoDB connection string (replace with your connection URI)
const mongoURI = 'mongodb+srv://nikhilhighwayplus:ELV1oQh5UNckX4gi@projecthighwayplus.1vehl.mongodb.net/ProjectHighwayPlus';

// Connect to MongoDB
connect(mongoURI).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});

// Export the connection object
export default mongoose;
