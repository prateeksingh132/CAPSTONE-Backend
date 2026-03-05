import express from 'express';
import { getSalesData } from '../controller/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// logic: mapping the analytics endpoint. applying my dual-layer defense here.
// protect ensures they are logged in, and admin ensures they actually have the admin role.
router.route('/sales').get(protect, admin, getSalesData);

export default router;