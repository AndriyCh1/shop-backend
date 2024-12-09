import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

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

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
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
