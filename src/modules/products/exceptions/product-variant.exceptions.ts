import { NotFoundException } from '@nestjs/common';

export class ProductVariantNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Variant with ID ${id} not found.`);
  }
}
