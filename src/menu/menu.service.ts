import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuCategoryService {
    constructor(private prisma: PrismaService) {}

    create(hotelId: number, data: { name: string; description?: string; image?: string }) {
        if (!data.name) {
            throw new BadRequestException('Category name is required');
        }
        return this.prisma.category.create({
            data: { ...data, hotel_id: hotelId },
        });
    }

    findAll(hotelId: number) {
        return this.prisma.category.findMany({ where: { hotel_id: hotelId } });
    }

    findOne(hotelId: number, id: number) {
        return this.prisma.category.findUnique({
            where: { category_id: id, hotel_id: hotelId },
        });
    }

    update(hotelId: number, id: number, data: { name?: string; description?: string; image?: string }) {
        return this.prisma.category.update({
            where: { category_id: id, hotel_id: hotelId },
            data,
        });
    }

    remove(hotelId: number, id: number) {
        return this.prisma.category.delete({
            where: { category_id: id, hotel_id: hotelId },
        });
    }
}
