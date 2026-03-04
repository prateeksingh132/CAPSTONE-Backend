import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// logic: this middleware extracts the jwt from the httponly cookie instead of the standard authorization header.
// this is practical bcuz it neutralizes xss attacks since the token is completely invisible to client side javascript.
// https://github.com/betheashvin/mern-secure-auth
// https://dev.to/mayankrsagar/local-storage-vs-cookies-for-jwt-auth-in-mern-e14

export const protect = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            // logic: verifying the signature using my server secret so i know nobody tampered with the token.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // logic: fetching the user from the database but explicitly removing the hashed password from the result for security.
            // then i attach this secure profile to the req object so my other controllers can use it.
            req.user = await User.findById(decoded.userId).select('-password');

            ////////////TESTING
            // console.log(`TESTING: auth guard passed for user: ${req.user.email}`);
            ////////////

            next();
        } catch (error) {
            console.error("token verification failed:", error.message);
            res.status(401);
            // logic: passing the error to my globalerr middleware
            next(new Error("not authorized, token verification failed"));
        }
    } else {
        res.status(401);
        next(new Error("not authorized, no token present in cookies"));
    }
};

// logic: so the idea here is establishing a strict role-based access control gate.
// this ensures standard users cannot execute bad operations or view admin stuff.

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        next(new Error("not authorized, strictly admin access only"));
    }
};