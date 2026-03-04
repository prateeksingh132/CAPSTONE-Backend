/////// logging middleware

import dayjs from 'dayjs';

// Goal: create a middleware to log requests.

// using dayjs for formatting dates.
// https://www.npmjs.com/package/dayjs


export function logReq(req, res, next) {

    // using dayjs to format the current time nicely
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // i want to see the method and the url in my terminal so i know what is happening
    console.log(`[${currentTime}] [Request]: ${req.method} ${req.url}`);

    // Important: must call next() otherwise the app gets stuck here and browser keeps spinning
    next();
}