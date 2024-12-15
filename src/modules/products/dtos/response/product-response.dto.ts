import { Product } from '#database/entities/products.entity';

export class ProductResponseDto {
  id: Product['id'];
  name: Product['name'];
  description: Product['description'];
  shortDescription: Product['shortDescription'];
  cumulativeRatingSum: Product['cumulativeRatingSum'];
  reviewCount: Product['reviewCount'];
}
