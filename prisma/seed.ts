import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Hotel Paradise",
      description: "Luxury 5-star hotel",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      status: "ACTIVE",
      email: "contact@paradise.com"
    }
  })

  const admin = await prisma.user.create({
    data: {
      hotel_id: hotel.hotel_id,
      role: "hotel_admin",
      name: "Sanskar Admin",
      email: "admin@paradise.com",
      password_hash: "hashedpassword"
    }
  })

  const category = await prisma.menuCategory.create({
    data: {
      hotel_id: hotel.hotel_id,
      name: "Starters",
    }
  })

  await prisma.menuItem.createMany({
    data: [
      {
        category_id: category.category_id,
        hotel_id: hotel.hotel_id,
        name: "Paneer Tikka",
        price: 250
      },
      {
        category_id: category.category_id,
        hotel_id: hotel.hotel_id,
        name: "Chicken Kebab",
        price: 300
      }
    ]
  })
}

main()
  .then(() => console.log("Seeding finished."))
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

