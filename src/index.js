import express from 'express';
const app = express();
import cors from 'cors';
import { config } from 'dotenv';
import bodyParser from 'body-parser'; // Importing body-parser
import authRoutes from './routes/authenticate.js';
import vehicleOwnerRoutes from './routes/vehicle-Owner/vehicleOwner.js';
import vehicleHistoryRoutes from './routes/vehicle-Owner/vehicleHistory.js';
import personalInfoRoutes from './routes/personalInfo.js';

// Load environment variables
config({
    path: "./.env"
});

const port = process.env.PORT || 4001;

// Import your database connection
import('./db/db.js');

// CORS setup
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

// Using body-parser for handling JSON and URL-encoded bodies
app.use(bodyParser.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));

// Sample route to check backend status
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Route handlers
app.use('/authenticate', authRoutes);
app.use('/vehicle-owner', vehicleOwnerRoutes);
app.use('/vehicleHistory', vehicleHistoryRoutes);
app.use('/personalInfo', personalInfoRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
