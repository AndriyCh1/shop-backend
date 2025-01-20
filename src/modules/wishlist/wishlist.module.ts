import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wishlist } from '#database/entities/wishlist.entity';
import { WishlistService } from '#modules/wishlist/services/wishlist.service';
import { WishlistController } from '#modules/wishlist/wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
