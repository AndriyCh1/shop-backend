import { Attributes } from '#database/entities/product-variants.entity';

export interface CreateProductVariantData {
  productId: number;
  name?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  salePrice: number;
  comparedPrice?: number;
  stockQuantity: number;
  displayOrder: number;
  attributes?: Attributes;
}

export type UpdateProductVariantData = Partial<CreateProductVariantData>;
