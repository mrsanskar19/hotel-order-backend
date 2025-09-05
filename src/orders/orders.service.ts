import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client'; // Import enums

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async create(hotelId: number, data: { customer_id: number; table_id?: string; total_amount: number; payment_mode: PaymentMethod; status?: OrderStatus; items: { item_id: number; quantity: number; price: number }[] }) {
        if (!data.customer_id || !data.total_amount || !data.payment_mode || !data.items || data.items.length === 0) {
            throw new BadRequestException('Customer ID, total amount, payment mode, and items are required');
        }
        if (!Object.values(PaymentMethod).includes(data.payment_mode)) {
            throw new BadRequestException('Invalid payment mode');
        }
        const customer = await this.prisma.customer.findUnique({ where: { customer_id: data.customer_id } });
        if (!customer) {
            throw new BadRequestException('Invalid customer');
        }
        for (const item of data.items) {
            const menuItem = await this.prisma.menuItem.findUnique({ where: { item_id: item.item_id, hotel_id: hotelId } });
            if (!menuItem || !menuItem.available) {
                throw new BadRequestException(`Item ${item.item_id} is invalid or unavailable`);
            }
            if (item.quantity < 1 || item.price < 0) {
                throw new BadRequestException('Invalid quantity or price');
            }
        }
        return this.prisma.order.create({
            data: {
                ...data,
                hotel_id: hotelId,
                status: data.status ?? OrderStatus.PENDING, // Use enum and nullish coalescing
                items: { create: data.items.map(item => ({ item_id: item.item_id, quantity: item.quantity, price: item.price })) },
            },
        });
    }

    findAll(hotelId: number) {
        return this.prisma.order.findMany({ where: { hotel_id: hotelId }, include: { items: true } });
    }

    findOne(hotelId: number, orderId: number) {
        return this.prisma.order.findUnique({
            where: { order_id: orderId, hotel_id: hotelId },
            include: { items: true },
        });
    }

    async update(hotelId: number, orderId: number, data: { table_id?: string; total_amount?: number; payment_mode?: PaymentMethod; status?: OrderStatus }) {
        if (data.payment_mode && !Object.values(PaymentMethod).includes(data.payment_mode)) {
            throw new BadRequestException('Invalid payment mode');
        }
        if (data.status && !Object.values(OrderStatus).includes(data.status)) {
            throw new BadRequestException('Invalid status');
        }
        return this.prisma.order.update({
            where: { order_id: orderId, hotel_id: hotelId },
            data,
        });
    }

    remove(hotelId: number, orderId: number) {
        return this.prisma.order.delete({
            where: { order_id: orderId, hotel_id: hotelId },
        });
    }
}
