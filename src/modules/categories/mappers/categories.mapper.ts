import { Category } from '#database/entities/categories.entity';
import { CategoryResponseDto } from '#modules/categories/dtos/response/category-response.dto';

export class CategoryMapper {
  static toResponse(entity: Category): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isRoot: entity.isRoot,
      isLeaf: entity.isLeaf,
    };
  }

  static toResponseList(entities: Category[]): CategoryResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
