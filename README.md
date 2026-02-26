# CAPSTONE - Backend


## Capstone Frontend Link:

https://github.com/prateeksingh132/CAPSTONE-Frontend.git


# Data Models:
* User: username, email, password, role ('user' or 'admin'), wishlist (referenced to Products).
* Product: name, price, category, stock, specs (mongoose map type for dynamic key-values).
* Review: rating, text, user (referenced), product (referenced). will use compound index which ensures 1 review per user per product.
* Order: user (referenced), orderItems (embedded snapshot: name, price, qty), totalPrice, isPaid.

# Routes:
* Public routes: GET /api/products (to show the list) and GET /api/products/:id (for details).
* Auth routes: POST /api/auth/login (using JWT)
* Protected routes: POST /api/orders (for checkout) and POST /api/chat (for the AI tech advisor).
* Admin route: GET /api/admin/stats (i am gonna use aggregation pipeline here to calculate total inventory value and other analytics, similar to what i did in sba 319)."