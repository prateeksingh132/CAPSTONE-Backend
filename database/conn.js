import mongoose from 'mongoose';

// logic: all of my database connection logic here.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        ////////////TESTING
        // console.log('TESTING: database connection established successfully ...');
        ////////////
    } catch (error) {
        console.error("database connection failed. shutting down process...", error.message);
        process.exit(1);
    }
};

export default connectDB;