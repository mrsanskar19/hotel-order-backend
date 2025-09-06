
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway()
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {
    this.loadTempData();
  }

  private orders: any[] = [];
  private tables: any[] = [];
  private tempFilePath = path.join(__dirname, 'tempData.json');

  private loadTempData() {
    try {
      const data = fs.readFileSync(this.tempFilePath, 'utf-8');
      const json = JSON.parse(data);
      this.orders = json.orders || [];
      this.tables = json.tables || [];
    } catch (e) {
      this.orders = [];
      this.tables = [];
    }
  }

  private saveTempData() {
    fs.writeFileSync(this.tempFilePath, JSON.stringify({ orders: this.orders, tables: this.tables }, null, 2));
  }

  @SubscribeMessage('joinTable')
  handleJoinTable(
    @MessageBody() data: { hotelId: number; tableId: string },
  ) {
    const room = `hotel:${data.hotelId}:table:${data.tableId}`;
    // Check if table already exists before pushing a new entry
    let table = this.tables.find(
      (t) => t.hotel_id === data.hotelId && t.table_id === data.tableId
    );
    if (!table) {
      // Only push if not already present
      table = {
        hotel_id: data.hotelId,
        table_id: data.tableId,
        status: 'OCCUPIED',
      };
      this.tables.push(table);
    } else {
      // Update status if already exists
      table.status = 'OCCUPIED';
    }
    this.saveTempData();
    this.server.socketsJoin(room);
    return { message: `Joined ${room}` };
  }

  @SubscribeMessage('closeOrder')
  async handleCloseOrder(
    @MessageBody() data: { orderId: number; hotelId: number; tableId: string },
  ) {
    // Find order in temp array
    const orderIndex = this.orders.findIndex(
      (o) =>
        o.order_id === data.orderId &&
        o.hotel_id === data.hotelId &&
        o.table_id === data.tableId,
    );
    if (orderIndex === -1) throw new Error('Order not found');
    const order = this.orders[orderIndex];
  order.status = OrderStatus.DELIVERED;
    // Save to DB
    const dbOrder = await this.prisma.order.create({
      data: {
        hotel_id: order.hotel_id,
        customer_id: order.customer_id,
        table_id: order.table_id,
        total_amount: order.total_amount,
        payment_mode: order.payment_mode,
        status: order.status,
        items: {
          create: order.items.map((item: any) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
    // Remove from temp array
    this.orders.splice(orderIndex, 1);
    this.saveTempData();
    this.server
      .to(`hotel:${data.hotelId}:table:${data.tableId}`)
      .emit('orderClosed', dbOrder);
    return dbOrder;
  }

  @SubscribeMessage('getDashboardOrders')
  async handleGetDashboardOrders(
    @MessageBody() data: { hotelId: number },
  ) {
    const orders = this.orders.filter((o) => o.hotel_id === data.hotelId);
    this.server.to(`hotel:${data.hotelId}`).emit('dashboardOrders', orders);
    return orders;
  }


  @SubscribeMessage('getTableData')
  async handleGetTableData(
    @MessageBody() data: { hotelId: number },
  ) {
    
    const tables = this.tables.filter((t) => t.hotel_id === data.hotelId);
    this.server.to(`hotel:${data.hotelId}`).emit('dashboardTables', tables);
    return tables;
  }

  @SubscribeMessage('getOrders')
  async handleGetOrders(
    @MessageBody() data: { hotelId: number; tableId: string },
  ) {
    const orders = this.orders.filter(
      (o) => o.hotel_id === data.hotelId && o.table_id === data.tableId
    );
    this.server
      .to(`hotel:${data.hotelId}:table:${data.tableId}`)
      .emit('orders', orders);
    return orders;
  }

  @SubscribeMessage('createOrder')
  async handleCreateOrder(
    @MessageBody()
    data: {
      hotelId: number;
      tableId: string;
      total_amount: number;
      payment_mode: PaymentMethod;
      items: { item_id: number; quantity: number; price: number }[];
    },
  ) {
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
    // Update table status
    let table = this.tables.find(
      (t) => t.hotel_id === data.hotelId && t.table_id === data.tableId
    );
    if (!table) {
      table = {
        hotel_id: data.hotelId,
        table_id: data.tableId,
        status: 'OCCUPIED',
      };
      this.tables.push(table);
    } else {
      table.status = 'OCCUPIED';
    }
    this.saveTempData();
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
      await this.prisma.orderItem.create({
        data: {
          order_id: data.orderId,
          item_id: data.itemId,
          quantity: data.qty,
          price: itemPrice,
        },
      });
      order = await this.prisma.order.findUnique({
        where: { order_id: data.orderId, hotel_id: data.hotelId },
        include: { items: true },
      });
      if (!order) throw new Error('Order not found');
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
