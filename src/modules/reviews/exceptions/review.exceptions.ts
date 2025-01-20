import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class ReviewNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Review with ID ${id} not found`);
  }
}

export class ReviewWasNotCreatedException extends InternalServerErrorException {
  constructor() {
    super('Review was not created');
  }
}
