# API Documentation

This document provides a detailed description of all the API routes in the application.

## App

### GET /

- **Description:** Returns a welcome message.
- **Response (200):**
    ```
    "Hello World!"
    ```

---

## Hotel

### POST /hotel

- **Description:** Creates a new hotel.
- **Request Body:**
    ```json
    {
      "name": "The Grand Hotel",
      "description": "A luxurious hotel with a beautiful view.",
      "email": "contact@thegrandhotel.com",
      "phone": "123-456-7890",
      "address": "123 Main Street, Anytown, USA",
      "images": "[\"image1.jpg\", \"image2.jpg\"]",
      "active_time": "9am - 10pm",
      "parcel_available": true,
      "is_active": true,
      "username": "grandhotel",
      "password": "password123"
    }
    ```
- **Response (201):**
    ```json
    {
      "hotel_id": 1,
      "name": "The Grand Hotel",
      "description": "A luxurious hotel with a beautiful view.",
      "email": "contact@thegrandhotel.com",
      "phone": "123-456-7890",
      "address": "123 Main Street, Anytown, USA",
      "images": "[\"image1.jpg\", \"image2.jpg\"]",
      "active_time": "9am - 10pm",
      "parcel_available": true,
      "is_active": true,
      "username": "grandhotel",
      "created_at": "2023-10-27T10:00:00.000Z"
    }
    ```

### GET /hotel/:id

- **Description:** Retrieves a hotel by its ID.
- **Response (200):** (Same as the response for POST /hotel)

### PUT /hotel/:id

- **Description:** Updates a hotel's information.
- **Request Body:**
    ```json
    {
      "name": "The Grand Hotel & Spa",
      "phone": "098-765-4321"
    }
    ```
- **Response (200):** (The updated hotel object)

### DELETE /hotel/:id

- **Description:** Deletes a hotel.
- **Response (200):**
    ```json
    {
      "message": "Hotel deleted successfully"
    }
    ```

### GET /hotel/:id/report

- **Description:** Retrieves a report for a hotel.
- **Response (200):** (The report data)

### GET /hotel/:id/revenue

- **Description:** Retrieves revenue information for a hotel.
- **Response (200):** (The revenue data)

---

## Auth

### POST /auth/login

- **Description:** Authenticates a user and returns a JWT.
- **Request Body:**
    ```json
    {
      "username": "grandhotel",
      "password": "password123"
    }
    ```
- **Response (200):**
    ```json
    {
      "message": "Login successful",
      "payload": {
        "sub": 1,
        "username": "grandhotel"
      }
    }
    ```

### POST /auth/logout

- **Description:** Logs out the user.
- **Response (200):**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

## Menu Categories

### POST /hotel/:hotelId/categories

- **Description:** Creates a new menu category.
- **Request Body:**
    ```json
    {
      "name": "Appetizers",
      "description": "Starters to whet your appetite.",
      "image": "appetizers.jpg"
    }
    ```
- **Response (201):**
    ```json
    {
      "category_id": 1,
      "hotel_id": 1,
      "name": "Appetizers",
      "description": "Starters to whet your appetite.",
      "image": "appetizers.jpg"
    }
    ```

### GET /hotel/:hotelId/categories

- **Description:** Retrieves all menu categories for a hotel.
- **Response (200):** (An array of category objects)

### GET /hotel/:hotelId/categories/:id

- **Description:** Retrieves a specific menu category.
- **Response (200):** (A single category object)

### PUT /hotel/:hotelId/categories/:id

- **Description:** Updates a menu category.
- **Request Body:**
    ```json
    {
      "name": "Soups",
      "description": "Warm and comforting soups."
    }
    ```
- **Response (200):** (The updated category object)

### DELETE /hotel/:hotelId/categories/:id

- **Description:** Deletes a menu category.
- **Response (200):**
    ```json
    {
      "message": "Category deleted successfully"
    }
    ```

---

## Menu Items

### POST /hotel/:hotelId/items

- **Description:** Creates a new menu item.
- **Request Body:**
    ```json
    {
      "category_id": 1,
      "name": "Bruschetta",
      "description": "Toasted bread with tomatoes, garlic, and basil.",
      "price": 8.99,
      "available": true
    }
    ```
- **Response (201):**
    ```json
    {
      "item_id": 1,
      "category_id": 1,
      "name": "Bruschetta",
      "description": "Toasted bread with tomatoes, garlic, and basil.",
      "price": 8.99,
      "available": true
    }
    ```

### GET /hotel/:hotelId/items

- **Description:** Retrieves all menu items for a hotel.
- **Response (200):** (An array of item objects)

### GET /hotel/:hotelId/items/:itemId

- **Description:** Retrieves a specific menu item.
- **Response (200):** (A single item object)

### PUT /hotel/:hotelId/items/:itemId

- **Description:** Updates a menu item.
- **Request Body:**
    ```json
    {
      "price": 9.99
    }
    ```
- **Response (200):** (The updated item object)

### DELETE /hotel/:hotelId/items/:itemId

- **Description:** Deletes a menu item.
- **Response (200):**
    ```json
    {
      "message": "Item deleted successfully"
    }
    ```

### PATCH /hotel/:hotelId/item/:itemId/availability

- **Description:** Updates the availability of a menu item.
- **Request Body:**
    ```json
    {
      "available": false
    }
    ```
- **Response (200):** (The updated item object)

### GET /hotel/:hotelId/categories/:categoryId/items

- **Description:** Retrieves all menu items for a specific category.
- **Response (200):** (An array of item objects)

---

## Orders

### GET /orders/hotel/:hotelId/dashboard

- **Description:** Retrieves all orders for the hotel dashboard.
- **Response (200):** (An array of order objects)

### GET /orders/hotel/:hotelId/table/:tableId

- **Description:** Retrieves all orders for a specific table.
- **Response (200):** (An array of order objects)

### GET /orders/hotel/:hotelId/table/:tableId/occupy

- **Description:** Marks a table as occupied.
- **Response (200):** (The updated table object)

### GET /orders/hotel/:hotelId/table/:tableId/free

- **Description:** Marks a table as free.
- **Response (200):** (The updated table object)

### POST /orders

- **Description:** Creates a new order.
- **Request Body:**
    ```json
    {
      "hotelId": 1,
      "tableId": "T1",
      "total_amount": 25.98,
      "payment_mode": "CASH",
      "items": [
        {
          "item_id": 1,
          "quantity": 2,
          "price": 8.99
        },
        {
          "item_id": 2,
          "quantity": 1,
          "price": 7.99
        }
      ]
    }
    ```
- **Response (201):** (The newly created order object)

### PATCH /orders/:orderId/status

- **Description:** Updates the status of an order.
- **Request Body:**
    ```json
    {
      "hotelId": 1,
      "tableId": "T1",
      "status": "COMPLETED"
    }
    ```
- **Response (200):** (The updated order object)

### POST /orders/:orderId/item

- **Description:** Adds an item to an existing order.
- **Request Body:**
    ```json
    {
      "hotelId": 1,
      "tableId": "T1",
      "itemId": 3,
      "qty": 1,
      "price": 12.99
    }
    ```
- **Response (200):** (The updated order object)

---

## Admin

### GET /admin/hotels

- **Description:** Retrieves all hotels.
- **Response (200):** (An array of hotel objects)

### GET /admin/hotels/:id

- **Description:** Retrieves a hotel by its ID.
- **Response (200):** (A single hotel object)

### DELETE /admin/hotels/:id

- **Description:** Deletes a hotel.
- **Response (200):**
    ```json
    {
      "message": "Hotel deleted successfully"
    }
    ```

### GET /admin/users

- **Description:** Retrieves all users.
- **Response (200):** (An array of user objects)

### GET /admin/users/:id

- **Description:** Retrieves a user by their ID.
- **Response (200):** (A single user object)

### DELETE /admin/users/:id

- **Description:** Deletes a user.
- **Response (200):**
    ```json
    {
      "message": "User deleted successfully"
    }
    ```
