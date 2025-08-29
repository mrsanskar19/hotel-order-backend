routes:
GET    /hotels
GET    /hotels/:hotelId
Post    /hotels

GET    /hotels/:hotelId/categories
POST   /hotels/:hotelId/categories

GET    /hotels/:hotelId/categories/:categoryId/items
POST   /hotels/:hotelId/categories/:categoryId/items

GET    /hotels/:hotelId/orders
POST   /hotels/:hotelId/orders
PATCH  /hotels/:hotelId/orders/:orderId

