import mongoose from 'mongoose';

////adding from sba 319
// using mongoose map type for the specs field because different gadgets have different specs (like cpu or battery life). this lets me store key-value pairs without changing the schema every time.

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    // logic: adding an optional modelurl string to store the 3d .glb binary links for my webgl canvas.
    modelUrl: {
        type: String
    },
    specs: {
        type: Map,
        of: String
    }
}, { timestamps: true });


// logic: applying compound database indexing here. 
// my tech advisor controller and real-time voice search query the 'name' and 'category' fields many times using regex.
// the idea is that indexing them converts a slow collection scan into a fast lookup directly on the database hardware so the server doesnt crash under load.
productSchema.index({ name: 1, category: 1 });

// logic: adding a standalone index for category as well just in case i add category-specific dropdown filters later.
productSchema.index({ category: 1 });

export default mongoose.model('Product', productSchema);