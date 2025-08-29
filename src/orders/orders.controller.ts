import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('orders')
@UseGuards(ApiKeyGuard)
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Post(':hotelId')
  createOrder(@Param('hotelId') hotelId: string, @Body() body: any) {
    return this.prisma.order.create({
      data: {
        ...body,
        hotel_id: Number(hotelId),
        customer_id: Number(body.customer_id),
      },
    });
  }

  @Patch(':orderId/status')
  updateStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
    return this.prisma.order.update({
      where: { order_id: Number(orderId) },
      data: { status: body.status as OrderStatus }
    });
  }

  @Get(':hotelId')
  getOrders(@Param('hotelId') hotelId: string) {
    return this.prisma.order.findMany({
      where: { hotel_id: Number(hotelId) },
      include: { items: true }
    });
  }
}

