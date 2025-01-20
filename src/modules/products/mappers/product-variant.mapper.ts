import { ProductVariant } from '#database/entities/product-variants.entity';
import { ProductVariantResponseDto } from '#modules/products/dtos/response/product-variant-response.dto';

export class ProductVariantMapper {
  static toResponse(entity: ProductVariant): ProductVariantResponseDto {
    return {
      id: entity.id,
      productId: entity.productId,
      name: entity.name,
      description: entity.description,
      shortDescription: entity.shortDescription,
      sku: entity.sku,
      displayOrder: entity.displayOrder,
      salePrice: entity.salePrice,
      comparedPrice: entity.comparedPrice,
      stockQuantity: entity.stockQuantity,
      attributes: entity.attributes,
    };
  }

  static toResponseList(
    entities: ProductVariant[],
  ): ProductVariantResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
