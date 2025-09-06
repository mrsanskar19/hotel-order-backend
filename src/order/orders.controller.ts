import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentMethod, OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ Get all orders for hotel dashboard
  @Get('hotel/:hotelId/dashboard')
  async getDashboardOrders(@Param('hotelId') hotelId: number) {
    return this.ordersService.getDashboardOrders(Number(hotelId));
  }

  // ✅ Get orders for a specific table
  @Get('hotel/:hotelId/table/:tableId')
  async getTableOrders(
    @Param('hotelId') hotelId: number,
    @Param('tableId') tableId: string,
  ) {
    return this.ordersService.getTableOrders(Number(hotelId), tableId);
  }

   @Get('hotel/:hotelId/table/:tableId/occupy')
  async markOccupid(
    @Param('hotelId') hotelId: number,
    @Param('tableId') tableId: string,
  ) {
    return this.ordersService.markTableOccupied(Number(hotelId), tableId);
  }
   @Get('hotel/:hotelId/table/:tableId/free')
  async markFree(
    @Param('hotelId') hotelId: number,
    @Param('tableId') tableId: string,
  ) {
    return this.ordersService.markTableFree(Number(hotelId), tableId);
  }

  // ✅ Create order
  @Post()
  async createOrder(
    @Body()
    data: {
      hotelId: number;
      tableId: string;
      total_amount: number;
      payment_mode: PaymentMethod;
      items: { item_id: number; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.createOrder(data);
  }

  // ✅ Update order status
  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() data: { hotelId: number; tableId: string; status: OrderStatus },
  ) {
    return this.ordersService.updateOrderStatus(Number(orderId), data);
  }

  // ✅ Add item to an order
  @Post(':orderId/item')
  async addOrderItem(
    @Param('orderId') orderId: number,
    @Body()
    data: { hotelId: number; tableId: string; itemId: number; qty: number; price?: number },
  ) {
    return this.ordersService.addOrderItem(Number(orderId), data);
  }
}
