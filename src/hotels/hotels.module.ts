// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HotelsController],
  providers: [PrismaService],
})
export class HotelsModule {}

