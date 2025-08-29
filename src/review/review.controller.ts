import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ GET all reviews for a specific item
  // /reviews/item/:itemId
  @Get('item/:itemId')
  async findByItem(@Param('itemId') itemId: string) {
    return this.prisma.review.findMany({
      where: { item_id: Number(itemId) },
      include: { item: true, customer: true },
      orderBy: { created_at: 'desc' },
    });
  }

  // ✅ GET single review by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.prisma.review.findUnique({
      where: { review_id: Number(id) },
      include: { item: true, customer: true },
    });

    if (!review) throw new NotFoundException(`Review ${id} not found`);
    return review;
  }

  // ✅ POST /reviews → create a review for an item
  @Post()
  async create(@Body() body: any) {
    return this.prisma.review.create({
      data: {
        item_id: body.item_id,
        customer_id: body.customer_id,
        rating: body.rating,
        comment: body.comment,
      },
    });
  }
}

