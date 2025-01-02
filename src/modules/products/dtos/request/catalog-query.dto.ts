import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

import {
  toIntArrayOrSkip,
  toIntOrFallback,
  toNumberOrFallback,
} from '#shared/utils/convert-types.util';

export class CatalogQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => toIntArrayOrSkip(value))
  categoryIds: number[] = [];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumberOrFallback(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumberOrFallback(value))
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumberOrFallback(value))
  minRating?: number;

  @IsOptional()
  @IsIn(['price', 'rating', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @Transform(({ value }) => {
    if (value === 'asc' || value === 'desc') {
      return value.toUpperCase();
    }
  })
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toIntOrFallback(value))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toIntOrFallback(value))
  perPage?: number;
}
