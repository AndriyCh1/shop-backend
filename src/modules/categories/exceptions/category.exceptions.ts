import { BadRequestException, NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Category with ID ${id} not found.`);
  }
}

export class CategoryAlreadyExistsException extends BadRequestException {
  constructor(name: string) {
    super(`Category with name ${name} already exists.`);
  }
}
