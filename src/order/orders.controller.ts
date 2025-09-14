import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentMethod, OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ Get all orders for a hotel dashboard
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

  // ✅ Mark table as OCCUPIED
  @Get('hotel/:hotelId/table/:tableId/occupy')
  async markOccupied(
    @Param('hotelId') hotelId: number,
    @Param('tableId') tableId: string,
  ) {
    return this.ordersService.markTableOccupied(Number(hotelId), tableId);
  }

  // ✅ Mark table as FREE
  @Get('hotel/:hotelId/table/:tableId/free')
  async markFree(
    @Param('hotelId') hotelId: number,
    @Param('tableId') tableId: string,
  ) {
    return this.ordersService.markTableFree(Number(hotelId), tableId);
  }

  // ✅ Create a new order
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

  // ✅ Create draft order
  @Post('draft')
  async createDraftOrder(
    @Body()
    data: {
      hotelId: number;
      tableId: string;
      items?: { item_id: number; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.createDraftOrder(data);
  }

  // ✅ Update order status
  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body()
    data: {
      hotelId: number;
      tableId: string;
      status: OrderStatus;
    },
  ) {
    return this.ordersService.updateOrderStatus(Number(orderId), data);
  }

  // ✅ Add single item to order
  @Post(':orderId/item')
  async addOrderItem(
    @Param('orderId') orderId: number,
    @Body()
    data: {
      hotelId: number;
      tableId: string;
      itemId: number;
      qty: number;
      price?: number;
    },
  ) {
    return this.ordersService.addOrderItem(Number(orderId), data);
  }

  // ✅ Add multiple items to order (bulk)
  @Post(':orderId/items/bulk')
  async addMultipleOrderItems(
    @Param('orderId') orderId: number,
    @Body()
    data: {
      hotelId: number;
      tableId: string;
      items: { itemId: number; qty: number; price?: number }[];
    },
  ) {
    return this.ordersService.addMultipleOrderItems(Number(orderId), data);
  }

  // ✅ Reorder a previous order
  @Post(':orderId/reorder')
  async reorder(
    @Param('orderId') orderId: number,
    @Body()
    data: {
      hotelId: number;
      tableId: string;
    },
  ) {
    return this.ordersService.reorder(Number(orderId), data);
  }

  // ✅ Get all table statuses for hotel dashboard
@Get('hotel/:hotelId/tables/status')
async getTableStatuses(@Param('hotelId') hotelId: number) {
  return this.ordersService.getTableStatuses(Number(hotelId));
}

}

