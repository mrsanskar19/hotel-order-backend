Auth (/auth)
POST /auth/login — Login with username and password
POST /auth/logout — Logout

Hotel (/hotel)
POST /hotel — Create a hotel
GET /hotel/:id — Get hotel by ID
PUT /hotel/:id — Update hotel by ID
DELETE /hotel/:id — Delete hotel by ID

Menu Categories (/hotel/:hotelId/categories)
POST /hotel/:hotelId/categories — Create a menu category
GET /hotel/:hotelId/categories — List all categories for a hotel
GET /hotel/:hotelId/categories/:id — Get a category by ID
PUT /hotel/:hotelId/categories/:id — Update a category
DELETE /hotel/:hotelId/categories/:id — Delete a category

Menu Items (/hotel/:hotelId/items)
POST /hotel/:hotelId/items — Create a menu item
GET /hotel/:hotelId/items — List all menu items for a hotel
GET /hotel/:hotelId/items/:itemId — Get a menu item by ID
PUT /hotel/:hotelId/items/:itemId — Update a menu item
DELETE /hotel/:hotelId/items/:itemId — Delete a menu item
PATCH /hotel/:hotelId/item/:itemId/availability — Update item availability
GET /hotel/:hotelId/categories/:categoryId/items — List items by category

Orders (/hotel/:hotelId/orders)
POST /hotel/:hotelId/orders — Create an order
GET /hotel/:hotelId/orders — List all orders for a hotel
GET /hotel/:hotelId/orders/:orderId — Get an order by ID

Reviews (/hotel/:hotelId/item/:itemId/review)
POST /hotel/:hotelId/item/:itemId/review — Create a review for an item
GET /hotel/:hotelId/item/:itemId/review — List all reviews for an item
GET /hotel/:hotelId/item/:itemId/review/:reviewId — Get a review by ID
PUT /hotel/:hotelId/item/:itemId/review/:reviewId — Update a review
DELETE /hotel/:hotelId/item/:itemId/review/:reviewId — Delete a review