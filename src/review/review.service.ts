import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) {}

    async create(hotelId: number, itemId: number, data: { customer_id: number; rating: number; comment?: string }) {
        if (!data.customer_id || !data.rating) {
            throw new BadRequestException('Customer ID and rating are required');
        }
        if (data.rating < 1 || data.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }
        const item = await this.prisma.menuItem.findUnique({ where: { item_id: itemId, hotel_id: hotelId } });
        if (!item) {
            throw new BadRequestException('Invalid item for this hotel');
        }
        const customer = await this.prisma.customer.findUnique({ where: { customer_id: data.customer_id } });
        if (!customer) {
            throw new BadRequestException('Invalid customer');
        }
        return this.prisma.review.create({
            data: { ...data, hotel_id: hotelId, item_id: itemId },
        });
    }

    findAll(hotelId: number, itemId: number) {
        return this.prisma.review.findMany({
            where: { hotel_id: hotelId, item_id: itemId },
        });
    }

    findOne(hotelId: number, itemId: number, reviewId: number) {
        return this.prisma.review.findUnique({
            where: { review_id: reviewId, hotel_id: hotelId, item_id: itemId },
        });
    }

    async update(hotelId: number, itemId: number, reviewId: number, data: { rating?: number; comment?: string }) {
        if (data.rating && (data.rating < 1 || data.rating > 5)) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }
        return this.prisma.review.update({
            where: { review_id: reviewId, hotel_id: hotelId, item_id: itemId },
            data,
        });
    }

    remove(hotelId: number, itemId: number, reviewId: number) {
        return this.prisma.review.delete({
            where: { review_id: reviewId, hotel_id: hotelId, item_id: itemId },
        });
    }
}
