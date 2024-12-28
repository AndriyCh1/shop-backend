import { ProductReview } from '#database/entities/product-reviews.entity';
import { ReviewResponseDto } from '#modules/reviews/dtos/response/review-response.dto';

export class ReviewMapper {
  static toResponse(review: ProductReview): ReviewResponseDto {
    return {
      id: review.id,
      comment: review.comment || '',
      rating: review.rating,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: {
        id: review.user.id,
        firstName: review.user.firstName,
        lastName: review.user.lastName,
      },
    };
  }

  static toResponseList(reviews: ProductReview[]): ReviewResponseDto[] {
    return reviews.map((review) => this.toResponse(review));
  }
}
