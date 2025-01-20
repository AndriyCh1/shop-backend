import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPostalCode,
  IsString,
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

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  @IsPostalCode('any')
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}

export class ContactInfoDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsEmail()
  email?: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one item is required' })
  items: OrderItemDto[];

  // NOTE: It'll be prefilled when user selects shipping address from the dropdown
  // or when user fills the shipping address form
  @IsNotEmpty({ message: 'Shipping address is required' })
  shippingAddress: ShippingAddressDto;

  @IsNotEmpty({ message: 'Contact info is required' })
  contactInfo: ContactInfoDto;
}
