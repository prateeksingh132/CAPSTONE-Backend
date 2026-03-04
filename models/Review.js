import mongoose from 'mongoose';

////adding from sba 319
// logic:i am referencing both the user and product collections to build a many-to-many relationship.

const reviewSchema = new mongoose.Schema({

    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 },
    comment: { 
        type: String, 
        required: true },
    user: {
        type: 
        mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

// logic: i am gonna add a compound index here.
//  a user can add review on same product multiple times, so i have to prevent this-- validation
reviewSchema.index({ product: 1, user: 1 }, { unique: true });


export default mongoose.model('Review', reviewSchema);