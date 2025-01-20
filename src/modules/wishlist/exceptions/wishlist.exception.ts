import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class WishlistItemNotFoundException extends NotFoundException {
  constructor(productId?: number, userId?: number) {
    if (productId !== undefined && userId !== undefined) {
      super(
        `Wishlist item not found for product id ${productId} and user id ${userId}`,
      );
    }

    super('Wishlist item not found');
  }
}

export class WishlistItemWasNotAddedException extends InternalServerErrorException {
  constructor(productId: number, userId: number) {
    super(
      `Wishlist item was not added for product id ${productId} and user id ${userId}`,
    );
  }
}

export class WishlistItemAlreadyExistsException extends BadRequestException {
  constructor(productId: number, userId: number) {
    super(
      `Wishlist item already exists for product id ${productId} and user id ${userId}`,
    );
  }
}
