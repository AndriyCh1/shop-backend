export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: number;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;
