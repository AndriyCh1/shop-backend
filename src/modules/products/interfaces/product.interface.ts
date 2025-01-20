import { File } from '#shared/interfaces/file.interface';

interface CreateProductVariantData {
  name?: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  salePrice: number;
  comparedPrice?: number;
  stockQuantity: number;
  displayOrder: number;
  attributes?: Record<string, string>;
  images?: File[];
}

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  categoryIds?: number[];
  images?: File[];
  variants: CreateProductVariantData[];
}

export type UpdateProductData = Partial<CreateProductData>;
