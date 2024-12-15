import { PartialType } from '@nestjs/swagger';

import { CreateProductDto } from '#modules/products/dtos/request/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
