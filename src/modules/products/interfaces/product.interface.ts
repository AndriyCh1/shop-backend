import { File } from '#shared/interfaces/file.interface';

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  categoryIds?: number[];
  images?: File[];
}

export type UpdateProductData = Partial<CreateProductData>;
