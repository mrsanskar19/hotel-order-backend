import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class OrderGateway {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  // ✅ Join hotel + table room
  @SubscribeMessage('join_table')
  async handleJoinTable(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { hotelId: number; tableNo: number },
  ) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: Number(data.hotelId) },
    });

    if (!hotel) {
      client.emit('error', { message: `Hotel ${data.hotelId} does not exist` });
      return;
    }

    const room = `hotel:${data.hotelId}:table:${data.tableNo}`;
    client.join(room);
    client.emit('joined', { room, hotel, tableNo: data.tableNo });
  }

  // ✅ Start a new order for a table
  @SubscribeMessage('start_order')
  async handleStartOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { hotelId: number; tableNo: number; userId: number },
  ) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotel_id: Number(data.hotelId) },
    });
    if (!hotel) throw new Error('Hotel not found');

    // Check if a PENDING order already exists for this table
    let order = await this.prisma.order.findFirst({
      where: {
        hotel_id: data.hotelId,
        table_no: data.tableNo,
        status: OrderStatus.PENDING,
      },
      include: { items: true },
    });

    if (!order) {
      // Create new empty order
      order = await this.prisma.order.create({
        data: {
          hotel_id: data.hotelId,
          table_no: data.tableNo,
          customer_id: data.userId,
          status: OrderStatus.PENDING,
          total_amount: 0,
        },
        include: { items: true },
      });
    }

    const room = `hotel:${data.hotelId}:table:${data.tableNo}`;
    this.server.to(room).emit('order_started', order);
    client.emit('order_started', order);
  }

  // ✅ Add items (new or existing order)
  @SubscribeMessage('add_item')
  async handleAddItem(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { hotelId: number; tableNo: number; orderId?: number; itemId: number; qty: number; price?: number },
  ) {
    // 1. Validate order
    let order = data.orderId
      ? await this.prisma.order.findUnique({ where: { order_id: data.orderId } })
      : await this.prisma.order.findFirst({
          where: {
            hotel_id: data.hotelId,
            table_no: data.tableNo,
            status: OrderStatus.PENDING,
          },
        });

    if (!order) throw new Error('No active order found for this table');

    // 2. Validate item
    const item = await this.prisma.menuItem.findUnique({
      where: { item_id: data.itemId },
    });
    if (!item) throw new Error('Item not found');

    const finalPrice = data.price ?? item.price;

    // 3. Add item to order
    order = await this.prisma.order.update({
      where: { order_id: order.order_id },
      data: {
        items: {
          create: {
            item_id: data.itemId,
            quantity: data.qty,
            price: finalPrice,
          },
        },
        total_amount: { increment: finalPrice * data.qty },
      },
      include: { items: true },
    });

    const room = `hotel:${data.hotel_id}:table:${order.table_no}`;
    this.server.to(room).emit('order_updated', order);
  }

  // ✅ Close order
  @SubscribeMessage('close_order')
  async handleCloseOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: number },
  ) {
    try {
      const order = await this.prisma.order.update({
        where: { order_id: Number(data.orderId) },
        data: { status: OrderStatus.CANCELLED },
      });

      const room = `hotel:${order.hotel_id}:table:${order.table_no}`;
      this.server.to(room).emit('order_closed', order);
    } catch (err) {
      client.emit('error', { message: `Order ${data.orderId} not found` });
    }
  }

  // ✅ Chat inside a table
  @SubscribeMessage('send_message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { hotelId: number; tableNo: number; message: string },
  ) {
    const room = `hotel:${data.hotelId}:table:${data.tableNo}`;
    this.server.to(room).emit('new_message', {
      from: client.id,
      message: data.message,
    });
  }
}

