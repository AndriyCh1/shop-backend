import { PartialType } from '@nestjs/mapped-types';

import { CreateProductVariantDto } from '#modules/products/dtos/request/create-product-variant.dto';

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
