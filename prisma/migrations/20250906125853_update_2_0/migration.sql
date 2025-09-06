-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN "discount" REAL;
ALTER TABLE "MenuItem" ADD COLUMN "img" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
    "hotel_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "images" TEXT,
    "active_time" TEXT,
    "parcel_available" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "table_count" INTEGER NOT NULL DEFAULT 5,
    "plan" TEXT NOT NULL DEFAULT 'FREE'
);
INSERT INTO "new_Hotel" ("active_time", "address", "created_at", "description", "email", "hotel_id", "images", "is_active", "name", "parcel_available", "password", "phone", "username") SELECT "active_time", "address", "created_at", "description", "email", "hotel_id", "images", "is_active", "name", "parcel_available", "password", "phone", "username" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_email_key" ON "Hotel"("email");
CREATE UNIQUE INDEX "Hotel_username_key" ON "Hotel"("username");
CREATE TABLE "new_Order" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotel_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "table_id" TEXT,
    "total_amount" REAL NOT NULL,
    "payment_mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel" ("hotel_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("customer_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("created_at", "customer_id", "hotel_id", "order_id", "payment_mode", "status", "table_id", "total_amount") SELECT "created_at", "customer_id", "hotel_id", "order_id", "payment_mode", "status", "table_id", "total_amount" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
