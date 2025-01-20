import { ProductCatalogResponseDto } from '#modules/products/dtos/response/product-catalog.dto';
import { ProductCatalogEntity } from '#modules/products/interfaces/catalog.interface';

export class ProductCatalogMapper {
  static toResponse(product: ProductCatalogEntity): ProductCatalogResponseDto {
    return {
      id: product.id,
      variantId: product.variantId,
      salePrice: product.salePrice,
      comparedPrice: product.comparedPrice,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      rating: product.rating,
      cumulativeRatingSum: product.cumulativeRatingSum,
      reviewCount: product.reviewCount,
      image: product.image,
      createdAt: product.createdAt,
    };
  }

  static toResponseList(
    products: ProductCatalogEntity[],
  ): ProductCatalogResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
