import { Product } from '#database/entities/products.entity';

export class ProductCatalogResponseDto {
  id: Product['id'];
  name: Product['name'];
  variantId: Product['id'];
  salePrice: number;
  comparedPrice: number | null;
  description: Product['description'];
  shortDescription: Product['shortDescription'];
  rating: Product['rating'];
  cumulativeRatingSum: Product['cumulativeRatingSum'];
  reviewCount: Product['reviewCount'];
  image: string | null;
  createdAt: Product['createdAt'];
}
