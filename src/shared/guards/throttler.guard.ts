import { Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerGuards extends NestThrottlerGuard {
  // protected handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {}
  protected errorMessage: string;
}
