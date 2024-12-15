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

import { CreateProductDto } from '#modules/products/dtos/request/create-product.dto';
import { UpdateProductDto } from '#modules/products/dtos/request/update-product.dto';
import { ProductResponseDto } from '#modules/products/dtos/response/product-response.dto';
import { ProductMapper } from '#modules/products/mappers/product.mapper';
import { ProductsService } from '#modules/products/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<ProductResponseDto[]> {
    return ProductMapper.toResponseList(
      await this.productsService.getAllProducts(),
    );
  }

  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<ProductResponseDto> {
    return ProductMapper.toResponse(await this.productsService.getProduct(id));
  }

  @Get('categories/:id')
  async getProductsByCategoryId(
    @Param('id') id: number,
  ): Promise<ProductResponseDto[]> {
    return ProductMapper.toResponseList(
      await this.productsService.getProductsByCategoryId(id),
    );
  }

  // TODO: Use `Sharp` to resize images
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({ fileIsRequired: false }),
    )
    images?: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    return ProductMapper.toResponse(
      await this.productsService.createProduct({ ...dto, images }),
    );
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return ProductMapper.toResponse(
      await this.productsService.updateProduct(id, dto),
    );
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productsService.removeProduct(id);
  }
}
