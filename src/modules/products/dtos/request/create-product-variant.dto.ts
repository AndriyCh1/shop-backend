import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Attributes } from '#database/entities/product-variants.entity';

export class CreateProductVariantDto {
  @IsInt()
  productId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsInt()
  @Min(1)
  sequenceNumber: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  attributes?: Attributes;
}
