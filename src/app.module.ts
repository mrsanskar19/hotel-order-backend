import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderGateway } from './ws/order.gateway';
import { PrismaService } from './prisma/prisma.service';
import { HotelsModule } from './hotels/hotels.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderModule } from './order/orders.module';

@Module({
  imports: [
    HotelsModule,
    MenuModule,
    OrdersModule,
    ReviewModule,
    AuthModule,
    MenuItemModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, OrderGateway, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
