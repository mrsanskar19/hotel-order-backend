import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HotelsController {
  constructor(private readonly prisma: PrismaService) {}

  // ===============================
  // 🔹 HOTEL ROUTES
  // ===============================

  // GET /hotel → list all hotels
  @Get('hotel')
  async findAllHotels() {
    return this.prisma.hotel.findMany({
      select: {
        hotel_id: true,
        name: true,
        description: true,
        city: true,
        state: true,
        country: true,
        status: true,
      },
    });
  }

  // GET /hotel/:id → single hotel details + settings
  @Get('hotel/:id')
  async findHotel(@Param('id') id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: Number(id) },
      include: { settings: true },
    });
    if (!hotel) throw new NotFoundException(`Hotel ${id} not found`);
    return hotel;
  }

  // POST /hotel → create new hotel
  @Post('hotel')
  async createHotel(@Body() body: any) {
    return this.prisma.hotel.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        postal_code: body.postal_code,
        phone: body.phone,
        email: body.email,
        settings: {
          create: body.settings || [],
        },
      },
    });
  }

  // ===============================
  // 🔹 DASHBOARD ROUTE
  // ===============================

  // GET /hotel/:id/dashboard
  @Get('hotel/:id/dashboard')
  async getDashboard(@Param('id') id: string) {
    const hotelId = Number(id);

    const [pendingOrders, categoriesCount, usersCount] = await Promise.all([
      this.prisma.order.count({
        where: { hotel_id: hotelId, status: 'PENDING' },
      }),
      this.prisma.menuCategory.count({ where: { hotel_id: hotelId } }),
      this.prisma.user.count({ where: { hotel_id: hotelId } }),
    ]);

    return {
      pendingOrders,
      categoriesCount,
      usersCount,
    };
  }

  // ===============================
  // 🔹 ANALYTICS ROUTE
  // ===============================

  // GET /hotel/:id/analytics
  @Get('hotel/:id/analytics')
  async getAnalytics(@Param('id') id: string) {
    const hotelId = Number(id);
    const totalRevenue = await this.prisma.order.aggregate({
  where: { hotel_id: Number(id) },
  _sum: { total_amount: true },
});


    const [totalOrders, totalItems, reviewsCount] = await Promise.all([
      this.prisma.order.count({ where: { hotel_id: hotelId } }),
      this.prisma.menuItem.count({ where: { hotel_id: hotelId } }),
      this.prisma.review.count({ where: { hotel_id: hotelId } }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum?.total_amount || 0,
      totalItems,
      reviewsCount,
    };
  }

  // ===============================
  // 🔹 ADMIN ROUTES
  // ===============================

  // GET /admin/hotel → list all hotels with details
  @Get('admin/hotel')
  async findAllAdmin() {
    return this.prisma.hotel.findMany({
      include: {
        settings: true,
        categories: true,
        items: true,
        orders: true,
        reviews: true,
      },
    });
  }

  // GET /admin/hotel/:id → get one hotel with full details
  @Get('admin/hotel/:id')
  async findOneAdmin(@Param('id') id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: Number(id) },
      include: {
        settings: true,
        categories: true,
        items: true,
        orders: true,
        reviews: true,
      },
    });
    if (!hotel) throw new NotFoundException(`Hotel ${id} not found`);
    return hotel;
  }

  // POST /admin/hotel → create hotel (admin only)
  @Post('admin/hotel')
  async createAdmin(@Body() body: any) {
    return this.prisma.hotel.create({
      data: {
        name: body.name,
        description: body.description,
        city: body.city,
        state: body.state,
        country: body.country,
        phone: body.phone,
        email: body.email,
      },
    });
  }

  // DELETE /admin/hotel/:id → delete hotel
  @Delete('admin/hotel/:id')
  async deleteHotel(@Param('id') id: string) {
    return this.prisma.hotel.delete({ where: { hotel_id: Number(id) } });
  }
}

