// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelService } from './hotels.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HotelsController],
  providers: [PrismaService,HotelService],
})
export class HotelsModule {}

