import { Cart } from '#database/entities/carts.entity';
import { CartResponseDto } from '#modules/cart/dtos/response/cart-response.dto';

export class CartMapper {
  static toResponse(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      cartItems: cart.cartItems.map((cartItem) => ({
        id: cartItem.id,
        quantity: cartItem.quantity,
        createdAt: cartItem.createdAt,
        productVariant: {
          id: cartItem.productVariant.id,
          name: cartItem.productVariant.name,
          salePrice: cartItem.productVariant.salePrice,
          description: cartItem.productVariant.description,
          shortDescription: cartItem.productVariant.shortDescription,
          product: {
            id: cartItem.productVariant.product.id,
            name: cartItem.productVariant.product.name,
            description: cartItem.productVariant.product.description,
            shortDescription: cartItem.productVariant.product.shortDescription,
            cumulativeRatingSum:
              cartItem.productVariant.product.cumulativeRatingSum,
            reviewCount: cartItem.productVariant.product.reviewCount,
          },
        },
      })),
    };
  }

  static toResponseList(carts: Cart[]): CartResponseDto[] {
    return carts.map((cart) => this.toResponse(cart));
  }
}
