import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@Controller('hotel/:hotelId/orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Param('hotelId') hotelId: string,
    @Body()
    data: {
      customer_id: number;
      table_id?: string;
      total_amount: number;
      payment_mode: string;
      status?: string;
      items: { item_id: number; quantity: number; price: number }[];
    },
  ) {
    const paymentMode = Object.values(PaymentMethod).includes(
      data.payment_mode as PaymentMethod,
    )
      ? (data.payment_mode as PaymentMethod)
      : null;
    if (!paymentMode) {
      throw new BadRequestException('Invalid payment mode');
    }
    const status =
      data.status &&
      Object.values(OrderStatus).includes(data.status as OrderStatus)
        ? (data.status as OrderStatus)
        : undefined;
    return this.orderService.create(+hotelId, {
      ...data,
      payment_mode: paymentMode,
      status,
    });
  }

  @Get()
  findAll(@Param('hotelId') hotelId: string) {
    return this.orderService.findAll(+hotelId);
  }

  @Get(':orderId')
  findOne(
    @Param('hotelId') hotelId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.findOne(+hotelId, +orderId);
  }

  @Put(':orderId')
  update(
    @Param('hotelId') hotelId: string,
    @Param('orderId') orderId: string,
    @Body()
    data: {
      table_id?: string;
      total_amount?: number;
      payment_mode?: string;
      status?: string;
    },
  ) {
    const paymentMode =
      data.payment_mode &&
      Object.values(PaymentMethod).includes(data.payment_mode as PaymentMethod)
        ? (data.payment_mode as PaymentMethod)
        : undefined;
    const status =
      data.status &&
      Object.values(OrderStatus).includes(data.status as OrderStatus)
        ? (data.status as OrderStatus)
        : undefined;
    if (data.payment_mode && !paymentMode) {
      throw new BadRequestException('Invalid payment mode');
    }
    if (data.status && !status) {
      throw new BadRequestException('Invalid status');
    }
    return this.orderService.update(+hotelId, +orderId, {
      ...data,
      payment_mode: paymentMode,
      status,
    });
  }

  @Delete(':orderId')
  remove(@Param('hotelId') hotelId: string, @Param('orderId') orderId: string) {
    return this.orderService.remove(+hotelId, +orderId);
  }
}
