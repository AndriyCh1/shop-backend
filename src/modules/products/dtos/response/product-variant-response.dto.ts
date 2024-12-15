import { ProductVariant } from '#database/entities/product-variants.entity';

export class ProductVariantResponseDto {
  id: ProductVariant['id'];
  productId: ProductVariant['productId'];
  name: ProductVariant['name'];
  description: ProductVariant['description'];
  shortDescription: ProductVariant['shortDescription'];
  sku: ProductVariant['sku'];
  displayOrder: ProductVariant['displayOrder'];
  salePrice: ProductVariant['salePrice'];
  stockQuantity: ProductVariant['stockQuantity'];
  attributes: ProductVariant['attributes'];
}
