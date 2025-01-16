import { Category } from '#database/entities/categories.entity';

export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: number;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export type CategoryHierarchy = Category & { depth: number };
