import { ForbiddenException } from '@nestjs/common';

export class PermissionDeniedException extends ForbiddenException {
  constructor() {
    super('Permission denied');
  }
}
