//////// GadgetShack product controller
// goal: this file handles the logic for product routes.
//// referring from sba 319

import Product from '../models/Product.js';
import Review from '../models/Review.js';

// logic: i am gonna make a get all products route but this time i m gonna add fuzzy search to it, to allow flexibility
// idea is if someone searches for "laptop", mongodb can use regex to find it instead of needing an exact match.
// IMPORTANT: i tested http://localhost:3000/api/products?keyword=lap to get any keyword like name or description that matches lap, and i got the laptop one from my collection
export const getProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const products = await Product.find({ ...keyword });

        ////////////TESTING
        // console.log(`TESTING: fetched ${products.length} products from the database.`);
        ////////////

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// logic: fetching a single product by its id.
// my router.param middleware is gonna check if the id is a valid before this even runs.
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);


        // logic: fetching the reviews linked to this specific product and populating the username so i can display who wrote it.
        const reviews = await Review.find({ product: req.params.id }).populate('user', 'username');

        ////////////TESTING
        // console.log("TESTING: product:", product);
        ////////////

        if (product) {
            // logic: injecting the reviews array into the response payload before sending it to the frontend.
            res.status(200).json({ ...product._doc, reviews });
        } else {
            res.status(404);
            throw new Error("product not found in the database");
        }
    } catch (error) {
        next(error);
    }
};

// logic: admin route to create a sample product first, then they can edit it later.
export const createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: 'Sample name',
            price: 0,
            brand: 'Sample brand',
            category: 'Sample category',
            stock: 0,
            description: 'Sample description',
            image: '/images/sample.jpg',
            specs: {}
        });

        const createdProduct = await product.save();

        ////////////TESTING
        // console.log(`TESTING: sample product created by admin`);
        ////////////

        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// logic: admin route to actually update the product details.
// i am using fallback operators (||) here so if the admin only updates the price, the other fields stay the same.
export const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, brand, category, stock, specs } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            product.specs = specs || product.specs;

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404);
            throw new Error("product not found for update");
        }
    } catch (error) {
        next(error);
    }
};

// logic: admin route to delete a product from the database.
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();

            ////////////TESTING
            // console.log(`TESTING: product ${req.params.id} deleted permanently`);
            ////////////

            res.status(200).json({ message: "product removed successfully" });
        } else {
            res.status(404);
            throw new Error("product not found for deletion");
        }
    } catch (error) {
        next(error);
    }
};



///////notes for future
// i did the crud test on postman. post to http://localhost:3000/api/auth/login with admin username and password in raw json, to get the jwt cookie saved
// then , post to http://localhost:3000/api/products to add a sample product data in json body
// put and delete to http://localhost:3000/api/products/:id