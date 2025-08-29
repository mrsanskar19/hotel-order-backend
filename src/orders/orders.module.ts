// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [PrismaService],
})
export class OrdersModule {}

