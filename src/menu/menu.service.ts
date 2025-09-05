import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuCategoryService {
    constructor(private prisma: PrismaService) {}

    create(hotelId: number, data: { name: string; description?: string; image?: string }) {
        if (!data.name) {
            throw new BadRequestException('Category name is required');
        }
        return this.prisma.menuCategory.create({
            data: { ...data, hotel_id: hotelId },
        });
    }

    findAll(hotelId: number) {
        return this.prisma.menuCategory.findMany({ where: { hotel_id: hotelId } });
    }

    findOne(hotelId: number, id: number) {
        return this.prisma.menuCategory.findUnique({
            where: { category_id: id, hotel_id: hotelId },
        });
    }

    update(hotelId: number, id: number, data: { name?: string; description?: string; image?: string }) {
        return this.prisma.menuCategory.update({
            where: { category_id: id, hotel_id: hotelId },
            data,
        });
    }

    remove(hotelId: number, id: number) {
        return this.prisma.menuCategory.delete({
            where: { category_id: id, hotel_id: hotelId },
        });
    }
}
