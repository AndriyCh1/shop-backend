export interface CreateCategoryData {
  name: string;
  description?: string;
  isRoot?: boolean;
  isLeaf?: boolean;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;
