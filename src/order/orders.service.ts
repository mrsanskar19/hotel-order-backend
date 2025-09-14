import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { FileStorage } from '../common/utils/file-storage';

type OrderItem = { item_id: number; quantity: number; price: number };

export interface Order {
  order_id: number;
  hotel_id: number;
  customer_id: number;
  table_id: string;
  total_amount: number;
  payment_mode: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
}

export interface Table {
  hotel_id: number;
  table_id: string;
  status: 'OCCUPIED' | 'FREE';
}

@Injectable()
export class OrdersService {
  private ordersStorage = new FileStorage<Order>('orders.json');
  private tablesStorage = new FileStorage<Table>('tables.json');

  constructor() {}

  async getDashboardOrders(hotelId: number) {
    const orders = await this.ordersStorage.getAll();
    return orders.filter(o => o.hotel_id === hotelId);
  }

  async getTableOrders(hotelId: number, tableId: string) {
    const orders = await this.ordersStorage.getAll();
    return orders.filter(o => o.hotel_id === hotelId && o.table_id === tableId);
  }

  async markTableOccupied(hotelId: number, tableId: string) {
    const tables = await this.tablesStorage.getAll();
    const index = tables.findIndex(t => t.hotel_id === hotelId && t.table_id === tableId);

    if (index >= 0) {
      tables[index].status = 'OCCUPIED';
    } else {
      tables.push({ hotel_id: hotelId, table_id: tableId, status: 'OCCUPIED' });
    }

    await this.tablesStorage.saveAll(tables);
    return { hotel_id: hotelId, table_id: tableId, status: 'OCCUPIED' };
  }

  async markTableFree(hotelId: number, tableId: string) {
    const tables = await this.tablesStorage.getAll();
    const index = tables.findIndex(t => t.hotel_id === hotelId && t.table_id === tableId);

    if (index >= 0) {
      tables[index].status = 'FREE';
      await this.tablesStorage.saveAll(tables);
      return tables[index];
    }

    return null;
  }

  async createOrder(data: {
    hotelId: number;
    tableId: string;
    total_amount: number;
    payment_mode: PaymentMethod;
    items: OrderItem[];
  }) {
    const orders = await this.ordersStorage.getAll();

    const newOrder: Order = {
      order_id: Date.now(),
      hotel_id: data.hotelId,
      customer_id: 1,
      table_id: data.tableId,
      total_amount: data.total_amount,
      payment_mode: data.payment_mode,
      status: OrderStatus.PENDING,
      items: data.items,
    };

    orders.push(newOrder);
    await this.ordersStorage.saveAll(orders);

    await this.markTableOccupied(data.hotelId, data.tableId);

    return newOrder;
  }

  async updateOrderStatus(
    orderId: number,
    data: { hotelId: number; tableId: string; status: OrderStatus },
  ) {
    const orders = await this.ordersStorage.getAll();
    const index = orders.findIndex(o => o.order_id === orderId);

    if (index === -1) throw new Error('Order not found');

    orders[index].status = data.status;
    await this.ordersStorage.saveAll(orders);

    return orders[index];
  }

  async addOrderItem(
    orderId: number,
    data: { hotelId: number; tableId: string; itemId: number; qty: number; price?: number },
  ) {
    const orders = await this.ordersStorage.getAll();
    const index = orders.findIndex(o => o.order_id === orderId);

    if (index === -1) throw new Error('Order not found');

    const item: OrderItem = {
      item_id: data.itemId,
      quantity: data.qty,
      price: data.price ?? 0, // default price
    };

    orders[index].items.push(item);
    await this.ordersStorage.saveAll(orders);

    return orders[index];
  }

  // ✅ Add multiple items
  async addMultipleOrderItems(
    orderId: number,
    data: {
      hotelId: number;
      tableId: string;
      items: { itemId: number; qty: number; price?: number }[];
    },
  ) {
    const orders = await this.ordersStorage.getAll();
    const index = orders.findIndex(o => o.order_id === orderId);

    if (index === -1) throw new Error('Order not found');

    const newItems = data.items.map(i => ({
      item_id: i.itemId,
      quantity: i.qty,
      price: i.price ?? 0,
    }));

    orders[index].items.push(...newItems);
    await this.ordersStorage.saveAll(orders);

    return orders[index];
  }

  // ✅ Create a draft order
  async createDraftOrder(data: {
    hotelId: number;
    tableId: string;
    items?: OrderItem[];
  }) {
    const orders = await this.ordersStorage.getAll();

    const newOrder: Order = {
      order_id: Date.now(),
      hotel_id: data.hotelId,
      customer_id: 1,
      table_id: data.tableId,
      total_amount: 0,
      payment_mode: PaymentMethod.CASH,
      status: OrderStatus.PENDING,
      items: data.items ?? [],
    };

    orders.push(newOrder);
    await this.ordersStorage.saveAll(orders);

    await this.markTableOccupied(data.hotelId, data.tableId);

    return newOrder;
  }

  // ✅ Reorder previous order
  async reorder(
    orderId: number,
    data: { hotelId: number; tableId: string },
  ) {
    const orders = await this.ordersStorage.getAll();
    const oldOrder = orders.find(o => o.order_id === orderId);

    if (!oldOrder) throw new Error('Original order not found');

    const newOrder: Order = {
      ...oldOrder,
      order_id: Date.now(),
      hotel_id: data.hotelId,
      table_id: data.tableId,
      status: OrderStatus.PENDING,
    };

    orders.push(newOrder);
    await this.ordersStorage.saveAll(orders);

    await this.markTableOccupied(data.hotelId, data.tableId);

    return newOrder;
  }

  async getTableStatuses(hotelId: number) {
  const tables = await this.tablesStorage.getAll();
  return tables.filter((t) => t.hotel_id === hotelId);
}

}

