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




model Hotel {
  hotel_id         Int       @id @default(autoincrement())
  name             String
  description      String?
  email            String?   @unique
  phone            String?
  address          String?
  images           String?
  active_time      String?   // e.g. "9 AM - 11 PM"
  parcel_available Boolean   @default(true)
  is_active        Boolean   @default(true)
  username         String    @unique
  password         String
  created_at       DateTime  @default(now())
  table_count      Int       @default(5)
  plan             String    @default("FREE")

  categories       MenuCategory[]
  items            MenuItem[]
  reviews          Review[]
  orders           Order[]
}

model MenuCategory {
  category_id Int    @id @default(autoincrement())
  hotel_id    Int
  name        String
  description String?
  image       String?

  hotel Hotel        @relation(fields: [hotel_id], references: [hotel_id])
  items MenuItem[]
}

model MenuItem {
  item_id     Int     @id @default(autoincrement())
  category_id Int
  hotel_id    Int
  name        String
  description String?
  price       Float
  available   Boolean @default(true)
  img         String?
  discount    Float?

  category   MenuCategory @relation(fields: [category_id], references: [category_id])
  hotel      Hotel        @relation(fields: [hotel_id], references: [hotel_id])
  reviews    Review[]
  orders     OrderItem[]
}

model Customer {
  customer_id Int    @id @default(autoincrement())
  email       String @unique
  phone       String?

  orders  Order[]
  reviews Review[]
}

model Order {
  order_id      Int       @id @default(autoincrement())
  hotel_id      Int
  customer_id   Int?
  table_id      String?
  total_amount  Float
  payment_mode  PaymentMethod
  status        OrderStatus @default(PENDING)
  created_at    DateTime @default(now())

  hotel    Hotel    @relation(fields: [hotel_id], references: [hotel_id])
  customer Customer? @relation(fields: [customer_id], references: [customer_id])
  items    OrderItem[]
}

model OrderItem {
  order_item_id Int   @id @default(autoincrement())
  order_id      Int
  item_id       Int
  quantity      Int
  price         Float

  order Order    @relation(fields: [order_id], references: [order_id])
  item  MenuItem @relation(fields: [item_id], references: [item_id])
}

model Review {
  review_id   Int      @id @default(autoincrement())
  hotel_id    Int
  item_id     Int?
  customer_id Int
  rating      Int
  comment     String?
  created_at  DateTime @default(now())

  hotel    Hotel    @relation(fields: [hotel_id], references: [hotel_id])
  item     MenuItem? @relation(fields: [item_id], references: [item_id])
  customer Customer @relation(fields: [customer_id], references: [customer_id])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CARD
  CASH
  WALLET
  UPI
}
