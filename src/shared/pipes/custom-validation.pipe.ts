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
        const errorMessages = this.extractErrorMessages(errors);

        return new BadRequestException(errorMessages[0]);
      },
      ...options,
    });
  }

  private extractErrorMessages = (errors: ValidationError[]): string[] => {
    const messages: string[] = [];

    errors.forEach((error) => {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }

      if (error.children && error.children.length > 0) {
        messages.push(...this.extractErrorMessages(error.children));
      }
    });

    return messages;
  };
}
