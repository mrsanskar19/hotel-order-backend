// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
//
// async function main() {
//     const hotel1 = await prisma.hotel.create({
//       data: {
//         name: "Hotel Paradise",
//         description: "Luxury 5-star hotel with premium rooms and dining",
//         email: "contact@paradise.com",
//         phone: "9876543210",
//         address: "MG Road, Pune",
//         images: "hotel1.jpg",
//         active_time: "9 AM - 11 PM",
//         parcel_available: true,
//         is_active: true,
//         username: "paradise_admin",
//         password: "hashedpassword1",  // ⚠️ store only hashed passwords in production!
//       }
//     })
//
//     const hotel2 = await prisma.hotel.create({
//       data: {
//         name: "Spice Garden",
//         description: "Authentic Indian cuisine with family-friendly vibes",
//         email: "info@spicegarden.com",
//         phone: "9123456780",
//         address: "FC Road, Pune",
//         images: "hotel2.jpg",
//         active_time: "10 AM - 10 PM",
//         parcel_available: false,
//         is_active: true,
//         username: "spice_admin",
//         password: "hashedpassword2",
//       }
//     })
//
//   // 📂 Create Categories
//   const cat1 = await prisma.menuCategory.create({
//     data: {
//       hotel_id: hotel1.hotel_id,
//       name: "Starters",
//       description: "Tasty appetizers",
//       image: "starters.jpg"
//     }
//   })
//
//   const cat2 = await prisma.menuCategory.create({
//     data: {
//       hotel_id: hotel1.hotel_id,
//       name: "Main Course",
//       description: "Delicious mains",
//       image: "maincourse.jpg"
//     }
//   })
//
//   const cat3 = await prisma.menuCategory.create({
//     data: {
//       hotel_id: hotel2.hotel_id,
//       name: "Desserts",
//       description: "Sweet treats",
//       image: "desserts.jpg"
//     }
//   })
//
//   // 🍽️ Create Items
//   const item1 = await prisma.menuItem.create({
//     data: {
//       category_id: cat1.category_id,
//       hotel_id: hotel1.hotel_id,
//       name: "Paneer Tikka",
//       description: "Grilled cottage cheese with spices",
//       price: 250,
//       available: true
//     }
//   })
//
//   const item2 = await prisma.menuItem.create({
//     data: {
//       category_id: cat1.category_id,
//       hotel_id: hotel1.hotel_id,
//       name: "Chicken Kebab",
//       description: "Juicy chicken kebabs",
//       price: 300,
//       available: true
//     }
//   })
//
//   const item3 = await prisma.menuItem.create({
//     data: {
//       category_id: cat2.category_id,
//       hotel_id: hotel1.hotel_id,
//       name: "Butter Chicken",
//       description: "Classic North Indian dish",
//       price: 450,
//       available: true
//     }
//   })
//
//   const item4 = await prisma.menuItem.create({
//     data: {
//       category_id: cat3.category_id,
//       hotel_id: hotel2.hotel_id,
//       name: "Gulab Jamun",
//       description: "Sweet fried dough balls in syrup",
//       price: 120,
//       available: true
//     }
//   })
//
//   // 👤 Create Customers
//   const customer1 = await prisma.customer.create({
//     data: {
//       email: "john@example.com",
//       phone: "9998887776"
//     }
//   })
//
//   const customer2 = await prisma.customer.create({
//     data: {
//       email: "ravi@example.com",
//       phone: "7776665554"
//     }
//   })
//
//   // 🧾 Create Orders
//   const order1 = await prisma.order.create({
//     data: {
//       hotel_id: hotel1.hotel_id,
//       customer_id: customer1.customer_id,
//       table_id: "T1",
//       total_amount: 550,
//       payment_mode: "CARD",
//       status: "CONFIRMED",
//       items: {
//         create: [
//           { item_id: item1.item_id, quantity: 2, price: 250 },
//           { item_id: item2.item_id, quantity: 1, price: 300 }
//         ]
//       }
//     }
//   })
//
//   const order2 = await prisma.order.create({
//     data: {
//       hotel_id: hotel2.hotel_id,
//       customer_id: customer2.customer_id,
//       table_id: "T3",
//       total_amount: 120,
//       payment_mode: "CASH",
//       status: "PENDING",
//       items: {
//         create: [
//           { item_id: item4.item_id, quantity: 1, price: 120 }
//         ]
//       }
//     }
//   })
//
//   // ⭐ Create Reviews
//   await prisma.review.createMany({
//     data: [
//       {
//         hotel_id: hotel1.hotel_id,
//         item_id: item1.item_id,
//         customer_id: customer1.customer_id,
//         rating: 5,
//         comment: "Amazing Paneer Tikka!"
//       },
//       {
//         hotel_id: hotel2.hotel_id,
//         item_id: item4.item_id,
//         customer_id: customer2.customer_id,
//         rating: 4,
//         comment: "Gulab Jamun was delicious!"
//       }
//     ]
//   })
//
//   console.log("✅ Database seeded successfully!")
// }
//
// main()
// .catch(e => {
//   console.error("❌ Error while seeding:", e)
//   process.exit(1)
// })
// .finally(async () => {
//   await prisma.$disconnect()
// })
import bcrypt from "bcrypt";

const password = "test123";
const hashed = await bcrypt.hash(password, 10);
console.log(hashed);
