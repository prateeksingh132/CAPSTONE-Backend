import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './database/conn.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Order from './models/Order.js';

// importing the data arrays from our local failsafe data module
import { users, products as localProducts, reviews as rawReviews } from './database/data.js';

dotenv.config();

// creating seeder script
// goal: i wanna fetch real tech data from an external api and combine it with our local failsafe data.

const importData = async () => {
    try {
        await connectDB();

        // logic: clearing out everything first so we have a clean collection
        await Order.deleteMany();
        await Review.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // logic: hashing the passwords from our local failsafe users before inserting them
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = await Promise.all(users.map(async (user) => {
            return {
                ...user,
                password: await bcrypt.hash(user.password, salt)
            };
        }));

        // logic: inserting the secure users
        const createdUsers = await User.insertMany(hashedUsers);
        // logic: creating the admin user and standard users so we can attach them to reviews later
        const adminUser = createdUsers[0]._id;
        const standardUsers = createdUsers.slice(1);

        ////////////TESTING
        // console.log('TESTING: fetching external api data from dummyjson api tech categories...');
        ////////////

        // logic: fetching data from all tech-related dummyjson category endpoints using promise.all
        const endpoints = [
            'https://dummyjson.com/products/category/smartphones',
            'https://dummyjson.com/products/category/laptops',
            'https://dummyjson.com/products/category/tablets',
            'https://dummyjson.com/products/category/mobile-accessories'
        ];

        // sending all requests at the exact same time
        const responses = await Promise.all(endpoints.map(url => fetch(url)));
        const dataSets = await Promise.all(responses.map(res => res.json()));

        // logic: flattenning all the products arrays from the different categories into one single array
        let allApiProducts = [];
        dataSets.forEach(data => {
            allApiProducts = [...allApiProducts, ...data.products];
        });

        // logic: mapping the external api data to match our exact mongoose product schema
        // specifically keeping the specs map field i built earlier
        const formattedApiProducts = allApiProducts.map(apiItem => ({
            name: apiItem.title,
            brand: apiItem.brand || 'Generic',
            category: apiItem.category,
            description: apiItem.description,
            price: apiItem.price,
            stock: apiItem.stock,
            image: apiItem.thumbnail,
            specs: {
                'Rating': apiItem.rating.toString(),
                'Weight': apiItem.weight ? apiItem.weight.toString() + 'g' : 'N/A'
            }
        }));

        // logic: combining the fetched api products with our local failsafe products array
        const combinedProducts = [...formattedApiProducts, ...localProducts];

        // logic: inserting the combined list into the database
        const insertedProducts = await Product.insertMany(combinedProducts);

        // logic: mapping our local reviews to random users and random newly inserted products
        const mappedReviews = rawReviews.map(review => {
            // picking a random standard user
            const randomUser = standardUsers[Math.floor(Math.random() * standardUsers.length)]._id;
            // picking a random product
            const randomProduct = insertedProducts[Math.floor(Math.random() * insertedProducts.length)]._id;

            return {
                ...review,
                user: randomUser,
                product: randomProduct
            };
        });

        // logic: inserting the reviews one by one.
        // since we have a compound index preventing duplicate reviews from the same user on the same product, 
        // i am gonna wrap this in a try/catch so if math.random picks the exact same user and product twice, it will just skip it.
        for (const review of mappedReviews) {
            try {
                await Review.create(review);
            } catch (err) {

            }
        }

        ////////////TESTING
        console.log(`TESTING: Data Imported! ${insertedProducts.length} products and reviews seeded.`);
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
        await Order.deleteMany();
        await Review.deleteMany();
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