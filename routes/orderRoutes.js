import express from 'express';
import { addOrderItems } from '../controller/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// logic: mapping the checkout endpoint. i am putting the protect middleware here bcuz only logged-in users with a valid jwt cookie should be able to place an order.
router.route('/').post(protect, addOrderItems);

export default router;