import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('images'))
  createVariant(
    @Body() dto: CreateProductVariantDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({ fileIsRequired: false }),
    )
    images?: Express.Multer.File[],
  ) {
    return this.productVariantsService.createVariant({ ...dto, images });
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
