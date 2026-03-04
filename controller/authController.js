import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// logic: so i am creating the authentication logic into a dedicated controller here
// for sba 320, i used localstorage for tokens. so, idea here is to use bcryptjs to hash passwords and jsonwebtoken to generate a token, which we will inject securely into an http only cookie to stop attacks, especially xss attacks.
// https://github.com/betheashvin/mern-secure-auth
// https://github.com/piyush-eon/React-shopping-cart-context-with-reducer
// https://dev.to/mayankrsagar/local-storage-vs-cookies-for-jwt-auth-in-mern-e14

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // logic: checking if the user already exists so mongodb doesnt throw a duplicate key error.
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("user already exists in the system.");
        }

        // logic: i am gonna use bcryptjs to hash the user passwords before saving them.
        // this is crucial bcuz it stops plaintext exposure if the database ever gets breached.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        ////////////TESTING
        // console.log(`TESTING: new user registered securely: ${user.email}`);
        ////////////

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        // logic: passing the error to my custom globalerrr middleware
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // logic: securely comparing the plaintext input password against the hashed one saved in the database.
        if (user && (await bcrypt.compare(password, user.password))) {

            // logic: generating a json web token and attaching it to an httponly cookie.
            // this completely stops xss attacks bcuz the react client cant read or steal the token with javascript.
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development', // enforces https in production
                sameSite: 'strict', // stops csrf attacks
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            ////////////TESTING
            // console.log(`TESTING: user logged in securely: ${user.email}. httponly cookie attached.`);
            ////////////

            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            });

        } else {
            res.status(401);
            throw new Error("invalid email or password.");
        }
    } catch (error) {
        next(error);
    }
};

export const logoutUser = (req, res) => {
    // logic: i am gonna revoke access by clearing the http-only cookie on the server-side.
    // so, the client cant use a bad token for api requests anymore.
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    ////////////TESTING
    // console.log("TESTING: user logged out. cookie cleared.");
    ////////////

    res.status(200).json({ message: "logged out successfully." });
};