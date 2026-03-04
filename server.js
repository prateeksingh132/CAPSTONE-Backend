////////////////////////////////////////// Imports
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

///////// Import Logging Middleware
import { logReq } from "./middleware/logger.js";

///////// Import Error Handling Middleware
import { error404, globalErr } from './middleware/error.js';

///////// Import routes


//////// Import Database
import connectDB from './database/conn.js';

// load env vars from .env file
dotenv.config();

////////////////////////////////////////// Setups
const app = express();
const PORT = process.env.PORT || 3001;
// connect database
connectDB();



//////////////////////////////////////// Middleware
app.use(logReq);



//////////////////////////////////////// Routes

////////////TESTING
// app.get("/", (req, res) => {
//   res.send("testing read!");
// });
////////////TESTING


//////////////////////////////////////// Error Handling
app.use(error404);
app.use(globalErr);


////////////////////////////////////////// Listener
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});