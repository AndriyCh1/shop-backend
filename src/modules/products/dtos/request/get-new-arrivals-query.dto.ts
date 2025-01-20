import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

import { toIntOrFallback } from '#shared/utils/convert-types.util';

export class GenNewArrivalsQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toIntOrFallback(value))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toIntOrFallback(value, 20))
  perPage?: number;
}
