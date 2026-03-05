import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './database/conn.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

// creating seeder script
// goal: i am gonna make a script to wipe the database and load some starting data.

const importData = async () => {
    try {
        await connectDB();

        // logic: clear out everything first so we have a clean collection
        await Product.deleteMany();
        await User.deleteMany();

        // logic: i need some users, especially an admin so i can test my protected routes later.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const createdUsers = await User.insertMany([
            { username: 'admin', email: 'admin@gadgetshack.com', password: hashedPassword, role: 'admin' },
            { username: 'prateek', email: 'prateek@test.com', password: hashedPassword, role: 'user' }
        ]);

        // logic: adding some sample products with my new dynamic specs map
        const sampleProducts = [
            {
                name: 'Pro Video Editing Laptop',
                brand: 'TechMaster',
                category: 'Laptops',
                description: 'High performance laptop for heavy rendering tasks.',
                price: 1299.99,
                stock: 10,
                image: '/images/laptop.jpg',
                specs: { 'CPU': 'Intel i9', 'RAM': '32GB', 'Storage': '1TB SSD' }
            },
            {
                name: 'Noise Cancelling Headphones',
                brand: 'SoundPro',
                category: 'Audio',
                description: 'Immersive sound with active noise cancellation.',
                price: 299.99,
                stock: 25,
                image: '/images/headphones.jpg',
                specs: { 'Impedance': '32 Ohm', 'Battery Life': '30 hours' }
            }
        ];

        await Product.insertMany(sampleProducts);

        ////////////TESTING
        console.log('TESTING: Data Imported Successfully!');
        ////////////
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    // just a quick way to wipe the database if i need to start over.
    try {
        await connectDB();
        await Product.deleteMany();
        await User.deleteMany();

        ////////////TESTING
        console.log('TESTING: Data Destroyed!');
        ////////////
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// logic: reading the terminal arguments so i can just run 'node seeder.js -d' to delete data if i want to.
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}