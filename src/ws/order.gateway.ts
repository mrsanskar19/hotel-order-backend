import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';

@WebSocketGateway()
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  @SubscribeMessage('getOrders')
  async handleGetOrders(
    @MessageBody() data: { hotelId: number; tableId: string },
  ) {
    const orders = await this.prisma.order.findMany({
      where: { hotel_id: data.hotelId, table_id: data.tableId },
      include: { items: true },
    });
    this.server
      .to(`hotel:${data.hotelId}:table:${data.tableId}`)
      .emit('orders', orders);
  }

  @SubscribeMessage('createOrder')
  async handleCreateOrder(
    @MessageBody()
    data: {
      hotelId: number;
      tableId: string;
      customer_id: number;
      total_amount: number;
      payment_mode: PaymentMethod;
      items: { item_id: number; quantity: number; price: number }[];
    },
  ) {
    const order = await this.prisma.order.create({
      data: {
        hotel_id: data.hotelId,
        customer_id: data.customer_id,
        table_id: data.tableId,
        total_amount: data.total_amount,
        payment_mode: data.payment_mode,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map((item) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
    this.server
      .to(`hotel:${data.hotelId}:table:${data.tableId}`)
      .emit('orderCreated', order);
    return order;
  }

  @SubscribeMessage('updateOrderStatus')
  async handleUpdateOrderStatus(
    @MessageBody()
    data: {
      hotelId: number;
      tableId: string;
      orderId: number;
      status: OrderStatus;
    },
  ) {
    const order = await this.prisma.order.update({
      where: {
        order_id: data.orderId,
        hotel_id: data.hotelId,
        table_id: data.tableId,
      },
      data: { status: data.status },
      include: { items: true },
    });
    this.server
      .to(`hotel:${data.hotelId}:table:${order.table_id}`)
      .emit('orderUpdated', order);
    return order;
  }

  @SubscribeMessage('addOrderItem')
  async handleAddOrderItem(
    @MessageBody()
    data: {
      hotelId: number;
      tableId: string;
      orderId?: number;
      itemId: number;
      qty: number;
      price?: number;
    },
  ) {
    let order;
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { item_id: data.itemId },
    });
    if (!menuItem) {
      throw new Error('Menu item not found');
    }
    const itemPrice = data.price ?? menuItem.price;
    if (data.orderId) {
      order = await this.prisma.order.findUnique({
        where: { order_id: data.orderId, hotel_id: data.hotelId },
        include: { items: true },
      });
      if (!order) throw new Error('Order not found');
      await this.prisma.orderItem.create({
        data: {
          order_id: data.orderId,
          item_id: data.itemId,
          quantity: data.qty,
          price: itemPrice,
        },
      });
    } else {
      order = await this.prisma.order.create({
        data: {
          hotel_id: data.hotelId,
          customer_id: 1, // Placeholder; adjust based on auth
          table_id: data.tableId,
          total_amount: itemPrice * data.qty,
          payment_mode: PaymentMethod.CASH,
          status: OrderStatus.PENDING,
          items: {
            create: [
              { item_id: data.itemId, quantity: data.qty, price: itemPrice },
            ],
          },
        },
        include: { items: true },
      });
    }
    const room = `hotel:${data.hotelId}:table:${order.table_id}`;
    this.server.to(room).emit('orderUpdated', order);
    return order;
  }
}
