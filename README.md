# Capstone project:

## Project: GadgetShack (backend server)

**Brief Description:** "Gadgetshack" is an electronics e-commerce website. this gadgetshack backend is a stateless restful server built with node.js, express and mongodb. i decided to continue with my gadgetshack theme from my previous sbas (307, 308a, 318, 319 and 320), but since this is my final capstone project, i completely rebuilt the architecture. in sba 319, i used a basic view engine with html files on the server. for this capstone, i completely decoupled the frontend and backend. i built a secure rest api using node and express. 

my server handles secure jwt authentication, create analytics using aggregation and connects with external apis— this allows my react single page application (spa) to just focus on the ui. 


## Capstone Frontend Link:

https://github.com/prateeksingh132/CAPSTONE-Frontend.git


### Technology Used

* **node.js and express:** i used this to build the server and route all my restful endpoints.
* **mongodb:** my nosql database to store products, users, reviews and orders.
* **mongoose:** the odm (object data modeling) library i used heavily for building schemas, models and data validations.
* **bcryptjs:** i used this to hash user passwords before they are saved. this way, even if the database gets leaked, the passwords are safe.
* **jsonwebtoken (jwt):** i used this to create secure, stateless authentication tokens for my login system.
* **cookie-parser and cors:** i used these to securely pass my httpOnly cookies back and forth between my frontend (port 5173) and backend (port 3000).
* **openai api:** i integrated the openai sdk for my backend tech advisor logic. i used the gpt-4o-mini model to act as a smart tech advisor for the store so users can ask questions about the inventory.
* **dummyjson api:** i used this 3rd party public api in my `seeder.js` script to fetch realistic tech products.
* **dayjs:** i kept this third-party library from my previous sbas to format my terminal request logs nicely.



### Features and Requirement List

i checked the capstone requirement list and implemented them one by one. here is the detailed logic for each:

1. **data modeling:** 
   * **dynamic specs (mongoose map):** when i was building the `Product.js` model, i realized that different gadgets can have totally different specs. a gaming laptop has ram and a gpu, but a drone has flight time and a camera resolution. so i used a mongoose map type (`{ type: map, of: string }`) for the specs field, which lets me store dynamic key-value pairs without breaking the schema rules.
   * **zero-trust checkout logic:** in my `orderController.js`, i cant trust the frontend to send me the correct total price bcuz a malicious user could intercept the payload and change the price of a $1000 laptop to $1. so, i only let the frontend send an array of product ids and quantities. 
   * **server-side price calculation:** to fix this, i use `Promise.all` to map over that array, query the mongodb database for every single item to get the real, live price and then use a reduce function to calculate the total price securely on the server.

2. **four data collections with reasonable schemas:**
   * i created 4 models: `User`, `Product`, `Review`, and `Order`. 
   * **users:** stores member info, hashed passwords and a wishlist array that uses `ObjectId` references to the product collection.
   * **products:** stores the gadgets.
   * **reviews:** uses references to link a user to a product.
   * **orders:** stores the checkout data. 

3. **the document snapshot pattern:**
   * this is a huge upgrade for my capstone. in e-commerce, you cannot just link a product id in an order receipt. the idea is that if i sell a laptop today for $1200 and next year the price drops to $900, my old order history will change to $900 and can messup my financial records. 
   * to fix this, i implemented the document snapshot pattern in my `orderController.js` and `Order.js` schema. when a user checks out, my backend fetches the exact name and price at that exact time and embeds it directly into the order document so it cant be changed.

4. **backend security and httponly cookies (rbac):**
   * in older projects, i put auth tokens in local storage, which is bad bcuz malicious users can steal them using xss attacks. for this capstone, i completely moved to `httpOnly` jwt cookies. the browser handles it automatically and client-side javascript cant even see the token.
   * i also built strict role-based access control (rbac). i created a `protect` middleware to verify the cookie and an `admin` middleware to check the user's role. if a normal user tries to delete a product or view the sales dashboard, the middleware intercepts it and throws a 403 forbidden error.

5. **admin analytics and aggregation pipeline:**
   * for the admin dashboard, i wanted to show a graph of daily sales. the issue here was that pulling thousands of orders into my node server and using a javascript `reduce` loop would crash the event loop.
   * **aggregation pipeline:** instead, i used the mongodb aggregation pipeline (`$group`, `$sum`, `$datetostring`) in my `adminController.js`. i used the `$group` stage combined with `$datetostring` to format the timestamps into clean `yyyy-mm-dd` strings and then used the `$sum` operator to calculate the total sales and order count per day. this makes the mongodb to do the math and it just hands my server a formatted json array.
   * **recharts visualization:** then i feed this formatted json array directly into the **recharts** library (in frontend) to draw a nice, interactive line chart on the screen.

6. **tech advisor:**
   * i wanted to build a cool ai feature where users can ask questions about products and get instant reply, so i integrated the openai api in my `techAdvisorController.js`. 
   * the problem with integrating such features is that we can never put our secret api keys in frontend react code bcuz anyone can steal them from the browser dev tools. so my backend acts as a secure proxy. when a user asks a question, my backend first queries the db collection to find all products where the stock is greater than 0 (`$gt: 0`). 
   * i take that live inventory, stringify it into json and feed it directly into the openai system message as context. this forces the model to only recommend products that actually exist in my store. the frontend just gets the final answer and my secret key never goes in the react frontend. 
   * i also forced the model to return a strict json object containing the exact `productid` so my frontend can render a direct link to the item.

7. **fuzzy search:**
   * in my `productController.js`, i added regex fuzzy search logic (`$regex`, `$options: 'i'`). 
   * so if a user types "lap" in the frontend search bar, the database automatically filters and returns the "pro video editing laptop".

8. **data validation:**
  * i tried to add a lot of strict validations across my mongoose schemas and routes:
    * **enum:** `category` in my product schema can only be specific values (laptops, smartphones, audio, accessories, tablets) so we don't get weird typos.
    * **unique:** `email` and `username` in `User.js` must be unique to prevent duplicate accounts.
    * **min/max:** ratings in `Review.js` must be exactly between 1-5 and things like product price, stock and order quantities cannot be negative.
    * **required:** important fields like product name, price and user passwords are all required.
    * **regex:** i used a regex validation (`/^[0-9a-fA-F]{24}$/`) in my `router.param` to make sure any url id is actually a valid 24-character hex string before mongoose even tries to read it, this stops the server from crashing.
    * **compound index (spam protection):** i wanted to make sure a user cannot review the same product twice. earlier, i tried to do this with an if-check in the controller, but then i found out mongoose can do it with a unique compound index on user + product. so i added `{ product: 1, user: 1 }, { unique: true }` in my `Review.js` schema. this is a database-level rule that prevents review spam.

9. **global error handling:** * i built custom `error404` and `globalerr` middlewares. 
   * if a user enters a bad route or a db query fails, my middleware catches it and sends a clean, formatted json error message back to the frontend.



### How to Use the Application

since this is a decoupled api backend, there is no visual html view like in my older projects. here is a detailed step-by-step guide on how to set it up and test it locally using an api client like postman:

1. **installation & environment setup:**
   * prerequisite: make sure you are running Node.js v18 or higher on your machine.
   * clone the repository and run `npm install` in your terminal to grab all the backend dependencies (express, mongoose, bcryptjs, etc).
   * create a `.env` file right in the root directory. include these exact variables for the server to work properly:
     * `PORT=3000` (this MUST be exactly 3000. my frontend vite proxy is hardcoded to look for port 3000).
     * `MONGO_URI=` (your own mongodb atlas connection string. make sure to add /GadgetShack at the very end of the string so mongoose creates the correct database instead of defaulting to 'test')
     * `JWT_SECRET=` (a secure random string for hashing the auth cookies)
     * `NODE_ENV=development` 
     * `OPENAI_API_KEY=` (your active openai developer key for the tech advisor feature)

2. **database seeding:**
   * i wrote an automated seeder script to seed the db.
   * run `node seeder.js` in the terminal. 
   * this connects to the database, wipes the old collections and injects default users (including an admin account: `admin@gadgetshack.com` / `password123`) and a bunch of sample products with dynamic specs.
   * *(note: if you ever need to wipe the db completely, you can just run `node seeder.js -d`)*.

3. **running the server:**
   * run `npm run dev` to start the server using nodemon. or run `npm start` (which runs standard node).
   * you will see the nodemon startup lines, followed by a message saying `server running on port: 3000` and my testing log `testing: database connection established successfully ...`. this confirms the server and database are connected properly.

### Interacting with the api (postman)

once the server is running, you can use an api client like postman to test all the different endpoints. here is a detailed breakdown of how to interact with the different layers of my api:

* **testing public routes (no login required):**
  * you can test these right away without needing any auth cookies.
  * `GET /api/products`: fetches the whole seeded product catalog.
    * *tip:* you can test my regex fuzzy search feature by adding a query parameter like `/api/products?keyword=laptop` to the url.
  * `GET /api/products/:id`: fetches a single product. (just copy an `_id` string from the main catalog array).
  * `POST /api/chat/ask`: tests the ai tech advisor.
    * you must send a raw json body like: `{"prompt": "i need a computer for rendering heavy videos"}` to see the ai's response and recommended product.

* **testing authentication:**
  * i am using strict `httpOnly` cookies for security, you cannot just hit the protected routes right away.
  * you must first log in so postman can grab the token:
    * send a `POST` request to `/api/auth/login`.
    * under the body tab, select raw and json and send the admin credentials:
      * `{"email": "admin@gadgetshack.com", "password": "password123"}`
  * postman will automatically catch the returned jwt cookie and save it in the background for all future requests.

* **testing protected and admin routes (requires cookie):**
  * once you are logged in and postman is holding the cookie, you can test the secure endpoints:
  * `POST /api/orders`: this tests the secure checkout logic.
    * you have to send a raw json body with an `orderitems` array (including a real product id and quantity) to see my backend calculate the true price and create the document snapshot.
  * `GET /api/admin/sales`: this tests the mongodb aggregation pipeline.
    * it fetches the daily sales stats.
    * *note:* this route specifically requires the admin role. if you try this after logging in with the standard user account (`prateek@test.com`), my `admin` middleware will block and throw a 403 forbidden error.



### API References 

i built the api to follow strict rest principles. once again, since i am using `httpOnly` cookies, if you wanna test this in postman, you must hit the login route first so postman saves the cookie, otherwise the protected routes throw a 403 forbidden error.

| method | endpoint | description | access / body (json) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | registers a new user and hashes password. | public / `{ "username", "email", "password" }` |
| **POST** | `/api/auth/login` | authenticates user and sets the `httpOnly` cookie. | public / `{ "email", "password" }` |
| **POST** | `/api/auth/logout` | clears the `httpOnly` session cookie. | public |
| **GET** | `/api/products` | fetches all products. supports `?keyword=` search. | public |
| **GET** | `/api/products/:id` | fetches a specific product by its `ObjectId`. | public |
| **POST** | `/api/products` | creates a new sample product. | admin only |
| **PATCH**| `/api/products/:id` | updates product details. | admin / `{ "price": 999, "stock": 10 }` |
| **DELETE**| `/api/products/:id`| deletes a product permanently. | admin only |
| **POST** | `/api/orders` | submits a new checkout payload to create snapshot. | private / `{ "orderitems": [...] }` |
| **GET** | `/api/admin/sales` | fetches aggregated daily sales data for charts. | admin only |
| **POST** | `/api/chat/ask` | prompts the ai tech advisor using my tech advisor controller. | public / `{ "prompt": "i need a laptop.." }` |



# Testing

I have created (and used during code creation) test points (log statement) at multiple places in the code, I have not removed them. They are commented at the time of submission and can be uncommented for future debugging and code check. These code checks looks something like:

////////////TESTING
//console.log('TESTING: order snapshot created successfully: ', verifiedItems);
////////////




# references

* https://github.com/ed-roh/fullstack-admin
* https://www.youtube.com/watch?v=XnbUHzZkypQ
* https://stackoverflow.com/questions/73867289/mongoose-how-to-find-sales-quantities-of-specific-items-in-an-orders-table
* https://github.com/betheashvin/mern-secure-auth
* https://github.com/piyush-eon/React-shopping-cart-context-with-reducer
* https://dev.to/mayankrsagar/local-storage-vs-cookies-for-jwt-auth-in-mern-e14
* https://medium.com/@mukesh.ram/best-mongodb-schema-for-online-stores-on-mern-practical-guide-7d6a84f23a87
* https://github.com/shazaaly/node-ecommerce
* https://github.com/Paula-Refaat/api-ecommerce-mongoose-express
* https://github.com/bradtraversy/proshop-v2
* https://github.com/razak571/turboGPT
* https://github.com/deepankkartikey/AI-Coding-Assistant
* https://www.youtube.com/watch?v=wrHTcjSZQ1Y
* https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-i