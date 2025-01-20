import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtRefreshGuard } from '#modules/auth/guards/jwt-refresh.guard';
import { AuthUser } from '#modules/auth/interfaces/auth.interface';
import { CreateReviewDto } from '#modules/reviews/dtos/request/create-review.dto';
import { UpdateReviewDto } from '#modules/reviews/dtos/request/update-review.dto';
import { ReviewResponseDto } from '#modules/reviews/dtos/response/review-response.dto';
import { ReviewMapper } from '#modules/reviews/mappers/review.mapper';
import { ReviewsService } from '#modules/reviews/services/reviews.service';
import { User } from '#shared/decorators/user.decorator';

@Controller('/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('products/:productId')
  @UseGuards(JwtRefreshGuard)
  async addReview(
    @User() user: AuthUser,
    @Param('productId') productId: number,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return ReviewMapper.toResponse(
      await this.reviewsService.addReview(user.id, productId, dto),
    );
  }

  @Get('products/:productId')
  async getProductReviews(
    @Param('productId') productId: number,
  ): Promise<ReviewResponseDto[]> {
    return ReviewMapper.toResponseList(
      await this.reviewsService.getProductReviews(productId),
    );
  }

  @Patch(':id')
  @UseGuards(JwtRefreshGuard)
  async updateReview(
    @Param('id') id: number,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return ReviewMapper.toResponse(
      await this.reviewsService.updateReview(id, dto),
    );
  }

  @Delete(':id')
  deleteReview(@User() user: AuthUser, @Param('id') id: number): Promise<void> {
    return this.reviewsService.deleteReview(id);
  }
}
