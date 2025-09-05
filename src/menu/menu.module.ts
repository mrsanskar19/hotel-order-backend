// src/hotels/hotels.module.ts
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuCategoryService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MenuController],
  providers: [PrismaService,MenuCategoryService],
})
export class MenuModule {}

