import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
