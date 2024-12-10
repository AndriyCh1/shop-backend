export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  categoryIds?: number[];
}

export type UpdateProductData = Partial<CreateProductData>;
