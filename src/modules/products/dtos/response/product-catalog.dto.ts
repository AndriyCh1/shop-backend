export class ProductCatalogResponseDto {
  id: number;
  name: string;
  variantId: number;
  salePrice: number;
  description: string;
  shortDescription: string | null;
  rating: number;
  cumulativeRatingSum: number;
  reviewCount: number;
  image: string | null;
  createdAt: Date;
}
