import Order from '../models/Order.js';
import Product from '../models/Product.js';

// logic: i am gonna make the checkout controller here to handle new orders.
// the idea is that i create backend security here, and not trust the frontend (user) to send me the correct total price. this way i can cross verify
// so i m gonna take the product ids from the cart, look them up in my own database, and build the snapshot manually.
// https://medium.com/@mukesh.ram/best-mongodb-schema-for-online-stores-on-mern-practical-guide-7d6a84f23a87
// https://github.com/shazaaly/node-ecommerce
// https://github.com/Paula-Refaat/api-ecommerce-mongoose-express
// https://github.com/bradtraversy/proshop-v2

export const addOrderItems = async (req, res, next) => {
    try {
        const { orderItems } = req.body;

        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error("no order items received in the payload");
        }

        // logic: mapping over the items from the frontend and fetching the real prices from the database. 
        // this is the core of the document snapshot pattern. the idea is that i m gonna grab the exact price from db at checkout so users cant change it and saving it so it doesnt change if i update prices later.
        const verifiedItems = await Promise.all(orderItems.map(async (item) => {
            const dbProduct = await Product.findById(item.product);

            if (!dbProduct) {
                res.status(404);
                throw new Error(`product with id ${item.product} not found in database`);
            }

            return {
                product: dbProduct._id,
                name: dbProduct.name,
                price: dbProduct.price, // strictly trusting my database price, not the user's
                quantity: item.quantity
            };
        }));

        // logic: calculating the total price securely on the backend so users cant manipulate price.
        const totalPrice = verifiedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const order = new Order({
            user: req.user._id, // i get this safely from my protect middleware
            orderItems: verifiedItems,
            totalPrice
        });

        const createdOrder = await order.save();

        ////////////TESTING
        // console.log(`TESTING: snapshot order generated successfully for user: ${req.user._id} with total: $${totalPrice}`);
        ////////////

        res.status(201).json(createdOrder);

    } catch (error) {
        next(error);
    }
};