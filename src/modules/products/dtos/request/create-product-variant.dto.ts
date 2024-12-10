import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Attributes } from '#database/entities/product-variants.entity';

export class CreateProductVariantDto {
  @IsInt()
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

  @IsOptional()
  @IsNumber()
  salePrice: number;

  @IsOptional()
  @IsNumber()
  comparedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity = 0;

  @IsOptional()
  attributes?: Attributes;

  @IsInt()
  @Min(1)
  displayOrder: number;
}
