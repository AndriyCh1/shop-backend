import { Product } from '#database/entities/products.entity';

export class ProductResponseDto {
  id: Product['id'];
  name: Product['name'];
  salePrice: Product['salePrice'];
  description: Product['description'];
  shortDescription: Product['shortDescription'];
  previewImage: Product['previewImage'];
  cumulativeRatingSum: Product['cumulativeRatingSum'];
  ratingCount: Product['reviewCount'];
}
