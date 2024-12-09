import { Category } from '#database/entities/categories.entity';

export class CategoryResponseDto {
  id: Category['id'];
  name: Category['name'];
  description: Category['description'];
  isRoot: Category['isRoot'];
  isLeaf: Category['isLeaf'];
}
