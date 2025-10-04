import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemService {
    constructor(private prisma: PrismaService) {}

    async create(hotelId: number, data: { category_id: number; name: string; description?: string; price: number; available?: boolean }) {
        if (!data.name || !data.category_id || !data.price) {
            throw new BadRequestException('Name, category_id, and price are required');
        }
        if (data.price < 0) {
            throw new BadRequestException('Price cannot be negative');
        }
        const category = await this.prisma.category.findUnique({ where: { category_id: data.category_id, hotel_id: hotelId } });
        if (!category) {
            throw new BadRequestException('Invalid category for this hotel');
        }
        return this.prisma.menuItem.create({
            data: { ...data, hotel_id: hotelId },
        });
    }

    findAll(hotelId: number) {
        return this.prisma.menuItem.findMany({
            where: { hotel_id: hotelId },
            include: {
                category: true,
                reviews: true,
            },
        });
    }

    findOne(hotelId: number, itemId: number) {
        return this.prisma.menuItem.findUnique({
            where: { item_id: itemId, hotel_id: hotelId },
        });
    }

    async update(hotelId: number, itemId: number, data: { category_id?: number; name?: string; description?: string; price?: number; available?: boolean }) {
        if (data.price && data.price < 0) {
            throw new BadRequestException('Price cannot be negative');
        }
        if (data.category_id) {
            const category = await this.prisma.category.findUnique({ where: { category_id: data.category_id, hotel_id: hotelId } });
            if (!category) {
                throw new BadRequestException('Invalid category for this hotel');
            }
        }
        return this.prisma.menuItem.update({
            where: { item_id: itemId, hotel_id: hotelId },
            data,
        });
    }

    remove(hotelId: number, itemId: number) {
        return this.prisma.menuItem.delete({
            where: { item_id: itemId, hotel_id: hotelId },
        });
    }

    updateAvailability(hotelId: number, itemId: number, available: boolean) {
        return this.prisma.menuItem.update({
            where: { item_id: itemId, hotel_id: hotelId },
            data: { available },
        });
    }

    findByCategory(hotelId: number, categoryId: number) {
        return this.prisma.menuItem.findMany({
            where: { hotel_id: hotelId, category_id: categoryId },
        });
    }
}
