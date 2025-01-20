import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItem } from '#database/entities/cart-items.entity';
import { Cart } from '#database/entities/carts.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { CartService } from '#modules/cart/services/cart.service';

import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart, ProductVariant])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
