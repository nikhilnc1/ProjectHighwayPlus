import express, { json, urlencoded } from 'express';
const app = express()
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/authenticate.js';
import vehicleOwnerRoutes from './routes/vehicle-Owner/vehicleOwner.js';
import vehicleHistoryRoutes from './routes/vehicle-Owner/vehicleHistory.js';
import personalInfoRoutes from './routes/personalInfo.js';


config(
    {
        path : "./.env"
    }
)

const port = process.env.PORT || 4001;

import('./db/db.js')

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(json({limit : "16kb"}));
app.use(urlencoded({extended:true,limit : "16kb"}));

app.get('/', function(req, res){
    res.send('backend is working !');
})

app.use('/authenticate', authRoutes);
app.use('/vehicle-owner',vehicleOwnerRoutes);
app.use('/vehicleHistory', vehicleHistoryRoutes);
app.use('/personalInfo', personalInfoRoutes);

app.listen(port, () => {
    console.log("serveris running "+4000);
})

