import { Category } from '#database/entities/categories.entity';
import {
  CategoryHierarchyItemResponseDto,
  CategoryResponseDto,
} from '#modules/categories/dtos/response/category-response.dto';

export class CategoryMapper {
  static toResponse(entity: Category): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      parentId: entity.parentId,
    };
  }

  static toResponseList(entities: Category[]): CategoryResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  static toHierarchyResponse(
    entities: (Category & { depth: number })[],
  ): CategoryHierarchyItemResponseDto[] {
    return entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      parentId: entity.parentId,
      depth: entity.depth,
    }));
  }
}
