import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class OrderNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Order with ID ${id} not found.`);
  }
}

export class ProductVariantNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Product variant with ID ${id} not found.`);
  }
}

export class NotEnoughStockException extends UnprocessableEntityException {
  constructor(productVariantId: number, quantity: number) {
    super(
      `There is not enough stock for product variant with ID ${productVariantId}. Only ${quantity} are available.`,
    );
  }
}
