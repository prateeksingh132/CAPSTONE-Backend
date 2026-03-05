import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// logic: using the router.param idea from a stackoverflow example i used in sba 319.
// the idea is that this acts as a strict check to make sure only valid 24-character hex objectids hit the controllers.
// this stops mongodb cast errors from crashing my server if user types a weird url.
// https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
router.param('id', (req, res, next, id) => {
    // regex: start of line, 0-9 or a-f, exactly 24 chars, end of line
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
        res.status(400);
        return next(new Error("invalid database id format in the the route parameters.."));
    }
    next();
});

///// route definitions
// logic: mapping the endpoints. reading is public, but creating/updating/deleting is strictly for admins.
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;