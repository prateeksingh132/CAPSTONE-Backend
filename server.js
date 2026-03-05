////////////////////////////////////////// Imports
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';


///////// Import Logging Middleware
import { logReq } from "./middleware/logger.js";

///////// Import Error Handling Middleware
import { error404, globalErr } from './middleware/error.js';

///////// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

// updating default cors configuration so it accepts credentials (cookies) across origins.
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
// parse incoming cookies
app.use(cookieParser());

// logging middleware
app.use(logReq);



//////////////////////////////////////// Routes

////////////TESTING
// app.get("/", (req, res) => {
//   res.send("testing read!");
// });
////////////TESTING

// adding the authentication router
app.use('/api/auth', authRoutes);
// adding the products router
app.use('/api/products', productRoutes);
// adding the orders router
app.use('/api/orders', orderRoutes);
// adding the admins router
app.use('/api/admin', adminRoutes);


//////////////////////////////////////// Error Handling
app.use(error404);
app.use(globalErr);


////////////////////////////////////////// Listener
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});