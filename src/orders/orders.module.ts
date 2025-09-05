// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [PrismaService,OrderService],
})
export class OrdersModule {}

