import { Product } from '#database/entities/products.entity';
import { ProductResponseDto } from '#modules/products/dtos/response/product-response.dto';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      cumulativeRatingSum: product.cumulativeRatingSum,
      reviewCount: product.reviewCount,
    };
  }

  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
