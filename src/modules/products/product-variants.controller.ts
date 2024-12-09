import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateProductVariantDto } from '#modules/products/dtos/request/create-product-variant.dto';
import { UpdateProductVariantDto } from '#modules/products/dtos/request/update-product-variant.dto';
import { ProductVariantsService } from '#modules/products/services/product-variants.service';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Get()
  getAllVariants() {
    return this.productVariantsService.getAllVariants();
  }

  @Get(':id')
  getVariant(@Param('id') id: number) {
    return this.productVariantsService.getVariant(id);
  }

  @Post()
  createVariant(@Body() dto: CreateProductVariantDto) {
    return this.productVariantsService.createVariant(dto);
  }

  @Put(':id')
  updateVariant(@Param('id') id: number, @Body() dto: UpdateProductVariantDto) {
    return this.productVariantsService.updateVariant(id, dto);
  }

  @Delete(':id')
  removeVariant(@Param('id') id: number) {
    return this.productVariantsService.removeVariant(id);
  }
}
