import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private orders: any[] = [];
  private tables: any[] = [];

  constructor(private prisma: PrismaService) {}

  async getDashboardOrders(hotelId: number) {
    return this.orders.filter((o) => o.hotel_id === hotelId);
  }

  async getTableOrders(hotelId: number, tableId: string) {
    return this.orders.filter((o) => o.hotel_id === hotelId && o.table_id === tableId);
  }

  async getTableStatuses(hotelId: number) {
    const tables = this.tables.filter((t) => t.hotel_id === hotelId);
    return tables;
  }
  async markTableOccupied(hotelId: number, tableId: string) {
    let table = this.tables.find(
      (t) => t.hotel_id === hotelId && t.table_id === tableId
    );
    if (!table) {
      table = {
        hotel_id: hotelId,
        table_id: tableId,
        status: 'OCCUPIED',
      };
      this.tables.push(table);
    } else {
      table.status = 'OCCUPIED';
    }
    return table;
  }

  async markTableFree(hotelId: number, tableId: string) {
    const table = this.tables.filter(
      (t) => t.hotel_id === hotelId && t.table_id === tableId
    );
    return table;
  }


  async createOrder(data: {
    hotelId: number;
    tableId: string;
    total_amount: number;
    payment_mode: PaymentMethod;
    items: { item_id: number; quantity: number; price: number }[];
  }) {
    const order = {
      order_id: Date.now(),
      hotel_id: data.hotelId,
      customer_id: 1,
      table_id: data.tableId,
      total_amount: data.total_amount,
      payment_mode: data.payment_mode,
      status: OrderStatus.PENDING,
      items: data.items,
    };
    this.orders.push(order);
    return order;
  }

  async updateOrderStatus(
    orderId: number,
    data: { hotelId: number; tableId: string; status: OrderStatus },
  ) {
    const order = await this.prisma.order.update({
      where: { order_id: orderId },
      data: { status: data.status },
      include: { items: true },
    });
    return order;
  }

  async addOrderItem(
    orderId: number,
    data: { hotelId: number; tableId: string; itemId: number; qty: number; price?: number },
  ) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { item_id: data.itemId },
    });
    if (!menuItem) throw new Error('Menu item not found');

    const itemPrice = data.price ?? menuItem.price;

    await this.prisma.orderItem.create({
      data: {
        order_id: orderId,
        item_id: data.itemId,
        quantity: data.qty,
        price: itemPrice,
      },
    });

    return this.prisma.order.findUnique({
      where: { order_id: orderId },
      include: { items: true },
    });
  }
}
