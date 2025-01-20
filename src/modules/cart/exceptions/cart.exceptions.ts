import { NotFoundException } from '@nestjs/common';

export class CartNotFoundException extends NotFoundException {
  constructor() {
    super('Cart not found');
  }
}

export class CartItemNotFoundException extends NotFoundException {
  constructor() {
    super('Cart item not found');
  }
}

export class ProductVariantNotFoundException extends NotFoundException {
  constructor() {
    super('Product variant not found');
  }
}
