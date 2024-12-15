import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRoot?: boolean;

  @IsOptional()
  @IsBoolean()
  isLeaf?: boolean;
}
