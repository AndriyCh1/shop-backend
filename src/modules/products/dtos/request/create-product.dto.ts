import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Attributes } from '#database/entities/product-variants.entity';
import { File } from '#shared/interfaces/file.interface';

class CreateProductVariantDto {
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

  images?: File[];
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }: { value: string[] }) =>
    !value ? [] : value.map(Number),
  )
  categoryIds: number[] = [];

  @IsArray({ message: 'At least one variant is required' })
  @ArrayMinSize(1, { message: 'At least one variant is required' })
  @Type(() => CreateProductVariantDto)
  @ValidateNested({ each: true, message: 'Invalid variant or variants data' })
  variants: CreateProductVariantDto[];
}
