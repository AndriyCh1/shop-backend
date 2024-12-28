import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductReview } from '#database/entities/product-reviews.entity';
import {
  ReviewNotFoundException,
  ReviewWasNotCreatedException,
} from '#modules/reviews/exceptions/review.exceptions';
import {
  CreateReviewData,
  UpdateReviewData,
} from '#modules/reviews/interfaces/review.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewsRepository: Repository<ProductReview>,
  ) {}

  async addReview(
    userId: number,
    productId: number,
    payload: CreateReviewData,
  ): Promise<ProductReview> {
    const createdReview = await this.productReviewsRepository.save(
      this.productReviewsRepository.create({
        comment: payload.comment,
        rating: payload.rating,
        user: { id: userId },
        product: { id: productId },
      }),
    );

    const foundReview = await this.getReview(createdReview.id);

    if (!foundReview) {
      throw new ReviewWasNotCreatedException();
    }

    return foundReview;
  }

  async getReview(id: number): Promise<ProductReview | null> {
    return this.productReviewsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return this.productReviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });
  }

  async updateReview(
    id: number,
    payload: UpdateReviewData,
  ): Promise<ProductReview> {
    const updateResult = await this.productReviewsRepository.update(id, {
      comment: payload.comment,
      rating: payload.rating,
    });

    if (!updateResult.affected) {
      throw new ReviewNotFoundException(id);
    }

    const foundReview = await this.getReview(id);

    if (!foundReview) {
      throw new ReviewNotFoundException(id);
    }

    return foundReview;
  }

  async deleteReview(id: number): Promise<void> {
    const deleteResult = await this.productReviewsRepository.delete({ id });

    if (!deleteResult.affected) {
      throw new ReviewNotFoundException(id);
    }
  }
}
