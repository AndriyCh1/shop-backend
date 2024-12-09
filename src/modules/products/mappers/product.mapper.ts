import { Product } from '#database/entities/products.entity';
import { ProductResponseDto } from '#modules/products/dtos/response/product-response.dto';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      salePrice: product.salePrice,
      description: product.description,
      shortDescription: product.shortDescription,
      previewImage: product.previewImage,
      cumulativeRatingSum: product.cumulativeRatingSum,
      ratingCount: product.reviewCount,
    };
  }

  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
