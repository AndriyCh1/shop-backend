import { ProductReview } from '#database/entities/product-reviews.entity';

export class ReviewResponseDto {
  id: ProductReview['id'];
  comment: ProductReview['comment'];
  rating: ProductReview['rating'];
  createdAt: ProductReview['createdAt'];
  updatedAt: ProductReview['updatedAt'];
  user: {
    id: ProductReview['user']['id'];
    firstName: ProductReview['user']['firstName'];
    lastName: ProductReview['user']['lastName'];
  };
}
