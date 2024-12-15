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
import { ProductVariantResponseDto } from '#modules/products/dtos/response/product-variant-response.dto';
import { ProductVariantMapper } from '#modules/products/mappers/product-variant.mapper';
import { ProductVariantsService } from '#modules/products/services/product-variants.service';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Get()
  async getAllVariants(): Promise<ProductVariantResponseDto[]> {
    return ProductVariantMapper.toResponseList(
      await this.productVariantsService.getAllVariants(),
    );
  }

  @Get(':id')
  async getVariant(
    @Param('id') id: number,
  ): Promise<ProductVariantResponseDto> {
    return ProductVariantMapper.toResponse(
      await this.productVariantsService.getVariant(id),
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createVariant(
    @Body() dto: CreateProductVariantDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({ fileIsRequired: false }),
    )
    images?: Express.Multer.File[],
  ): Promise<ProductVariantResponseDto> {
    return ProductVariantMapper.toResponse(
      await this.productVariantsService.createVariant({ ...dto, images }),
    );
  }

  @Put(':id')
  async updateVariant(
    @Param('id') id: number,
    @Body() dto: UpdateProductVariantDto,
  ): Promise<ProductVariantResponseDto> {
    return ProductVariantMapper.toResponse(
      await this.productVariantsService.updateVariant(id, dto),
    );
  }

  @Delete(':id')
  removeVariant(@Param('id') id: number) {
    return this.productVariantsService.removeVariant(id);
  }
}
