import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const firstError = errors[0];
          const message =
            firstError.constraints[Object.keys(firstError.constraints)[0]];

          return new BadRequestException(message);
        }

        return new BadRequestException('Validation failed');
      },
      ...options,
    });
  }
}
