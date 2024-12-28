import { CartItem } from '#database/entities/cart-items.entity';
import { Cart } from '#database/entities/carts.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { Product } from '#database/entities/products.entity';

class ProductResponseDto {
  id: Product['id'];
  name: Product['name'];
  description: Product['description'];
  shortDescription: Product['shortDescription'];
  cumulativeRatingSum: Product['cumulativeRatingSum'];
  reviewCount: Product['reviewCount'];
}

class ProductVariantResponseDto {
  id: ProductVariant['id'];
  name: ProductVariant['name'];
  salePrice: ProductVariant['salePrice'];
  description: ProductVariant['description'];
  shortDescription: ProductVariant['shortDescription'];
  product: ProductResponseDto;
}

class CartItemResponseDto {
  id: CartItem['id'];
  quantity: CartItem['quantity'];
  createdAt: CartItem['createdAt'];
  productVariant: ProductVariantResponseDto;
}

export class CartResponseDto {
  id: Cart['id'];
  cartItems: CartItemResponseDto[];
}
