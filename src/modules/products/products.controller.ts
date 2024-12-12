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
import { ProductsService } from '#modules/products/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productsService.getProduct(id);
  }

  @Get('categories/:id')
  getProductsByCategoryId(@Param('id') id: number) {
    return this.productsService.getProductsByCategoryId(id);
  }

  // TODO: Use `Sharp` to resize images
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({ fileIsRequired: false }),
    )
    images?: Express.Multer.File[],
  ) {
    return this.productsService.createProduct({ ...dto, images });
  }

  @Put(':id')
  updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productsService.removeProduct(id);
  }
}
