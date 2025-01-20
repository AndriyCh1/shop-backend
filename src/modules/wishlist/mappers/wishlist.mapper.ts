import { Wishlist } from '#database/entities/wishlist.entity';
import { WishlistResponseDto } from '#modules/wishlist/dtos/response/wishlist-response.dto';

export class WishlistMapper {
  static toResponse(entity: Wishlist): WishlistResponseDto {
    return {
      id: entity.id,
      product: {
        id: entity.product.id,
        name: entity.product.name,
        description: entity.product.description,
        shortDescription: entity.product.shortDescription,
      },
    };
  }

  static toResponseList(entities: Wishlist[]): WishlistResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
