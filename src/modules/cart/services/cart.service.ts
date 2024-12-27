import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartItem } from '#database/entities/cart-items.entity';
import { Cart } from '#database/entities/carts.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { CreateCartItemDto } from '#modules/cart/dtos/request/create-cart-item.dto';
import { UpdateCartItemDto } from '#modules/cart/dtos/request/update-cart-item.dto';
import {
  CartItemNotFoundException,
  CartNotFoundException,
  ProductVariantNotFoundException,
} from '#modules/cart/exceptions/cart.exceptions';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'cartItems',
        'cartItems.productVariant',
        'cartItems.productVariant.product',
      ],
    });

    return cart;
  }

  async addToCart(userId: number, payload: CreateCartItemDto): Promise<Cart> {
    const { productVariantId, quantity } = payload;

    const productVariant = await this.productVariantRepository.findOne({
      where: { id: productVariantId },
    });

    if (!productVariant) {
      throw new ProductVariantNotFoundException();
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.productVariant'],
    });

    if (!cart) {
      const savedCart = await this.cartRepository.save(
        this.cartRepository.create({ user: { id: userId } }),
      );

      cart = await this.cartRepository.findOne({
        where: { id: savedCart.id },
        relations: ['cartItems', 'cartItems.productVariant'],
      });
    }

    const existingItem = cart.cartItems.find(
      (item) => item.productVariant.id === productVariantId,
    );

    if (!existingItem) {
      await this.cartItemsRepository.save(
        this.cartItemsRepository.create({
          productVariant: { id: productVariant.id },
          quantity,
          cart: { id: cart.id },
        }),
      );
    } else {
      await this.cartItemsRepository.update(
        { id: existingItem.id },
        { quantity },
      );
    }

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: number,
    cartItemId: number,
    payload: UpdateCartItemDto,
  ): Promise<Cart> {
    const { quantity } = payload;

    const updateResult = await this.cartItemsRepository.update(
      { id: cartItemId },
      { quantity },
    );

    if (updateResult.affected === 0) {
      throw new CartItemNotFoundException();
    }

    return this.getCart(userId);
  }

  async removeCartItem(userId: number, cartItemId: number): Promise<Cart> {
    const deletionResult = await this.cartItemsRepository.delete({
      id: cartItemId,
    });

    if (deletionResult.affected === 0) {
      throw new CartItemNotFoundException();
    }

    const cart = await this.getCart(userId);

    if (cart.cartItems.length === 0) {
      await this.clearCart(userId);

      return null;
    }

    return cart;
  }

  async clearCart(userId: number): Promise<void> {
    const deletionResult = await this.cartRepository.delete({
      user: { id: userId },
    });

    if (deletionResult.affected === 0) {
      throw new CartNotFoundException();
    }
  }
}
