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

export default mongoose.model('Product', productSchema);