/*
  Warnings:

  - The values [IN_PROGRESS,COMPLETED,REFUNDED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `max_items_limit` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `max_orders_limit` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `max_tables_limit` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `plan_name` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_end_date` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_start_date` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_status` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_type` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sub_total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customizations` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Order" ALTER COLUMN "status" TYPE "public"."OrderStatus_new" USING ("status"::text::"public"."OrderStatus_new");
ALTER TYPE "public"."OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "public"."OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Hotel" DROP COLUMN "max_items_limit",
DROP COLUMN "max_orders_limit",
DROP COLUMN "max_tables_limit",
DROP COLUMN "plan_name",
DROP COLUMN "subscription_end_date",
DROP COLUMN "subscription_start_date",
DROP COLUMN "subscription_status",
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "table_count" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "upi_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "discount",
DROP COLUMN "notes",
DROP COLUMN "order_type",
DROP COLUMN "sub_total",
DROP COLUMN "tax",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "customizations",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."OrderItemStatus";

-- DropEnum
DROP TYPE "public"."OrderType";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";
