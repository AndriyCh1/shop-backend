import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productVariantId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class ShippingAddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @IsString()
  addressLine2?: string;

  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  items: OrderItemDto[];

  @IsNumber()
  @ValidateIf((o) => !o.shippingAddress)
  shippingAddressId: number;

  @ValidateIf((o) => !o.shippingAddressId)
  shippingAddress: ShippingAddressDto;
}
