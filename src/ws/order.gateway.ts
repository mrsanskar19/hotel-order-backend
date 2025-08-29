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

  // ✅ Join hotel room
  @SubscribeMessage('join_hotel')
  async handleJoinHotel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { hotelId: number },
  ) {
    // Join hotel
const hotel = await this.prisma.hotel.findUnique({
  where: { hotel_id: Number(data.hotelId) }, // ✅ force int
});


    if (!hotel) {
      client.emit('error', { message: `Hotel ${data.hotelId} does not exist` });
      return;
    }

    const room = `hotel:${data.hotelId}`;
    client.join(room);
    client.emit('joined', { room, hotel });
  }

  // ✅ User posts a new order
 @SubscribeMessage('post_order')
async handlePostOrder(
  @ConnectedSocket() client: Socket,
  @MessageBody()
  data: { hotelId: number; userId: number; items: { itemId: number; qty: number; price?: number }[] },
) {
  // 1. Validate hotel
  const hotel = await this.prisma.hotel.findUnique({ where: { hotel_id: data.hotelId } });
  if (!hotel) throw new Error("Hotel not found");

  // 2. Validate user
 

  // 3. Validate items exist
  const itemIds = data.items.map(i => i.itemId);
  const existingItems = await this.prisma.menuItem.findMany({
    where: { item_id: { in: itemIds } },
    select: { item_id: true, price: true },
  });
  if (existingItems.length !== itemIds.length) {
    throw new Error("One or more items not found");
  }

  // 4. Compute total safely
  const totalAmount = data.items.reduce((sum, i) => {
    const item = existingItems.find(e => e.item_id === i.itemId);
    const price = i.price ?? item?.price ?? 0; // fallback to DB price if not provided
    return sum + price * i.qty;
  }, 0);

console.log(hotel,existingItems,totalAmount)
  // 5. Create order
 try {
  const order = await this.prisma.order.create({
    data: {
      hotel_id: data.hotelId,
      customer_id: data.userId,
      status: "PENDING",
      total_amount: totalAmount,
      items: {
        create: data.items.map(i => {
          const item = existingItems.find(e => e.item_id === i.itemId);
          const price = i.price ?? item?.price ?? 0;
          return {
            item_id: i.itemId,
            quantity: i.qty,
            price,
          };
        }),
      },
    },
    include: { items: true },
  });

  console.log("✅ Order created:", JSON.stringify(order, null, 2));
  const room = `hotel:${data.hotelId}`;
  this.server.to(room).emit('new_order', order);
  client.emit('order_created', order);
} catch (err: any) {
  console.error("❌ Prisma Error:");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
  console.error("Meta:", err.meta);
  console.error("Stack:", err.stack);
}
}

  // ✅ Add items to existing order
  @SubscribeMessage('add_item')
  async handleAddItem(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: number; itemId: number; qty: number; price: number },
  ) {
  const orderExists = await this.prisma.order.findUnique({
  where: { order_id: data.orderId },
});
if (!orderExists) throw new Error("Order not found before update");

    // Add item
const order = await this.prisma.order.update({
  where: { order_id: data.orderId }, // must exist
  data: {
    items: {
      create: {
        item_id: data.itemId,     // must exist
        quantity: data.qty,
        price: data.price,
      },
    },
    total_amount: {
      increment: data.qty * data.price,
    },
  },
  include: { items: true },
});

    const room = `hotel:${order.hotel_id}`;
    this.server.to(room).emit('order_updated', order);
  }

  // ✅ Close/Cancel order
  @SubscribeMessage('close_order')
  async handleCloseOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: number },
  ) {
    // Close order
try {
  const order = await this.prisma.order.update({
    where: { order_id: Number(data.orderId) },
    data: { status: OrderStatus.CANCELLED },
  });

  const room = `hotel:${order.hotel_id}`;
  this.server.to(room).emit('order_closed', order);
} catch (err) {
  client.emit('error', { message: `Order ${data.orderId} not found` }); // ✅ handle gracefully
}

  }

  // ✅ Chat inside hotel room
  @SubscribeMessage('send_message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { hotelId: number; message: string },
  ) {
    const room = `hotel:${data.hotelId}`;
    this.server.to(room).emit('new_message', {
      from: client.id,
      message: data.message,
    });
  }
}

