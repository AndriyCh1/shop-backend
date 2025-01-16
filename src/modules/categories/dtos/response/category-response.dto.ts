import { Category } from '#database/entities/categories.entity';
import { CategoryHierarchy } from '#modules/categories/interfaces/categories.interface';

export class CategoryResponseDto {
  id: Category['id'];
  name: Category['name'];
  description: Category['description'];
  parentId: Category['parentId'];
}

export class CategoryHierarchyItemResponseDto {
  id: Category['id'];
  name: Category['name'];
  description: Category['description'];
  parentId: Category['parentId'];
  depth: CategoryHierarchy['depth'];
}
