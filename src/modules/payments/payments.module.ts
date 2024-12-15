import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderStatus } from '#database/entities/order-statuses.entity';
import { Order } from '#database/entities/orders.entity';
import { PaymentsController } from '#modules/payments/payments.controller';
import { PaymentsService } from '#modules/payments/services/payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderStatus])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
