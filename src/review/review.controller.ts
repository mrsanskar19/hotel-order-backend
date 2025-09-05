import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('hotel/:hotelId/item/:itemId/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Body() data: { customer_id: number; rating: number; comment?: string }) {
    return this.reviewService.create(+hotelId, +itemId, data);
  }

  @Get()
  findAll(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string) {
    return this.reviewService.findAll(+hotelId, +itemId);
  }

  @Get(':reviewId')
  findOne(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Param('reviewId') reviewId: string) {
    return this.reviewService.findOne(+hotelId, +itemId, +reviewId);
  }

  @Put(':reviewId')
  update(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Param('reviewId') reviewId: string, @Body() data: { rating?: number; comment?: string }) {
    return this.reviewService.update(+hotelId, +itemId, +reviewId, data);
  }

  @Delete(':reviewId')
  remove(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Param('reviewId') reviewId: string) {
    return this.reviewService.remove(+hotelId, +itemId, +reviewId);
  }
}
