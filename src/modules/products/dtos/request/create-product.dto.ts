import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
}
