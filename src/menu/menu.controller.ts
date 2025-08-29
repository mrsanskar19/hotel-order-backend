// src/menu/menu.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('hotels/:hotelId/')
export class MenuController {
  constructor(private prisma: PrismaService) {}

  // Fetch all categories for a hotel
  @Get('categories')
  async getCategories(@Param('hotelId') hotelId: string) {
    return this.prisma.menuCategory.findMany({
      where: { hotel_id: Number(hotelId) },
    });
  }

  // Create a category for a hotel
  @Post('categories')
  async createCategory(@Param('hotelId') hotelId: string, @Body() body: any) {
    return this.prisma.menuCategory.create({
      data: {
        name: body.name,
        hotel_id: Number(hotelId),
      },
    });
  }

  // Fetch items in a category
  @Get('categories/:categoryId/items')
  async getItems(@Param('hotelId') hotelId: string, @Param('categoryId') categoryId: string) {
    return this.prisma.menuItem.findMany({
      where: {
        hotel_id: Number(hotelId),
        category_id: Number(categoryId),
      },
    });
  }

  // Create item in a category
  @Post('categories/:categoryId/items')
  async createItem(
    @Param('hotelId') hotelId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: any,
  ) {
    return this.prisma.menuItem.create({
      data: {
        name: body.name,
        price: body.price,
        hotel_id: Number(hotelId),
        category_id: Number(categoryId),
      },
    });
  }
}

