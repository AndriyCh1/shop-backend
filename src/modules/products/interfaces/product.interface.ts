export interface CreateProductData {
  name: string;
  salePrice: number;
  description: string;
  shortDescription: string;
  previewImage: string;
  categoryIds?: number[];
}

export type UpdateProductData = Partial<CreateProductData>;
