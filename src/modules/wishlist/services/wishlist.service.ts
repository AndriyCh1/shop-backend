import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from '#database/entities/wishlist.entity';
import {
  WishlistItemAlreadyExistsException,
  WishlistItemNotFoundException,
  WishlistItemWasNotAddedException,
} from '#modules/wishlist/exceptions/wishlist.exception';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    const foundWishlistItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (foundWishlistItem) {
      throw new WishlistItemAlreadyExistsException(productId, userId);
    }

    const createdWishlistItem = await this.wishlistRepository.save(
      this.wishlistRepository.create({
        user: { id: userId },
        product: { id: productId },
      }),
    );

    const wishlistItem = await this.wishlistRepository.findOne({
      where: { id: createdWishlistItem.id },
      relations: ['product'],
    });

    if (!wishlistItem) {
      throw new WishlistItemWasNotAddedException(productId, userId);
    }

    return wishlistItem;
  }

  async deleteFromWishlist(id: number): Promise<void> {
    const deletionResult = await this.wishlistRepository.delete({ id });

    if (deletionResult.affected === 0) {
      throw new WishlistItemNotFoundException();
    }
  }

  async getWishlist(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }
}
