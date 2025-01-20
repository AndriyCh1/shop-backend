import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductReview } from '#database/entities/product-reviews.entity';
import { ReviewsController } from '#modules/reviews/reviews.controller';
import { ReviewsService } from '#modules/reviews/services/reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
