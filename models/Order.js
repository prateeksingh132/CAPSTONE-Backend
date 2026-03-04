import mongoose from 'mongoose';

// logic: i am gonna implement the document snapshot pattern for orders.
// instead of just referencing the product id, i actually embed the name and price at the exact moment of checkout.
// if the price changes in the future, my old order receipts wont get messed up.
const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });


export default mongoose.model('Order', orderSchema);