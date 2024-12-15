import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItem } from '#database/entities/order-items.entity';
import { OrderStatus } from '#database/entities/order-statuses.entity';
import { Order } from '#database/entities/orders.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { UserAddress } from '#database/entities/user-addresses.entity';
import { OrdersService } from '#modules/orders/services/orders.service';

import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ProductVariant,
      OrderStatus,
      UserAddress,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
