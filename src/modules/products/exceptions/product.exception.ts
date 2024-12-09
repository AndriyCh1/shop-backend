import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Product with ID ${id} not found.`);
  }
}

export class FailedToCreateProductException extends UnprocessableEntityException {
  constructor() {
    super('Failed to create product');
  }
}
