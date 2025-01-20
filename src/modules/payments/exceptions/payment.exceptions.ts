import { ConflictException } from '@nestjs/common';

export class CannotPayForOrderException extends ConflictException {
  constructor() {
    super('Cannot pay for the order');
  }
}
