import { Attributes } from '#database/entities/product-variants.entity';
import { File } from '#shared/interfaces/file.interface';

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
  images?: File[];
}

export type UpdateProductVariantData = Partial<CreateProductVariantData>;
