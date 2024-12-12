import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Attributes } from '#database/entities/product-variants.entity';

export class CreateProductVariantDto {
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsNumber()
  @Type(() => Number)
  salePrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  comparedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stockQuantity = 0;

  @IsOptional()
  attributes?: Attributes;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  displayOrder: number;
}
