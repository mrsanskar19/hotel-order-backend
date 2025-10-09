import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderGateway } from './ws/order.gateway';
import { PrismaService } from './prisma/prisma.service';
import { OrderModule } from './order/orders.module';

@Module({
  imports: [
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, OrderGateway, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
