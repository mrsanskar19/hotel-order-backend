// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MenuController],
  providers: [PrismaService],
})
export class MenuModule {}

