import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CatalogQueryDto } from '#modules/products/dtos/request/catalog-query.dto';
import { CreateProductDto } from '#modules/products/dtos/request/create-product.dto';
import { UpdateProductDto } from '#modules/products/dtos/request/update-product.dto';
import { ProductCatalogResponseDto } from '#modules/products/dtos/response/product-catalog.dto';
import { ProductResponseDto } from '#modules/products/dtos/response/product-response.dto';
import { ProductMapper } from '#modules/products/mappers/product.mapper';
import { ProductCatalogMapper } from '#modules/products/mappers/product-catalog.mapper';
import { ProductCatalogService } from '#modules/products/services/product-catalog.service';
import { ProductsService } from '#modules/products/services/products.service';
import { Paginated } from '#shared/interfaces/pagination.interface';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productCatalogService: ProductCatalogService,
  ) {}

  @Get()
  async getAllProducts(): Promise<ProductResponseDto[]> {
    return ProductMapper.toResponseList(
      await this.productsService.getAllProducts(),
    );
  }

  @Get('/catalog')
  async getCatalog(
    @Query() query?: CatalogQueryDto,
  ): Promise<Paginated<ProductCatalogResponseDto[]>> {
    const {
      search,
      categoryIds,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      sortOrder,
      page,
      perPage,
    } = query;
    const { data, ...restCatalog } =
      await this.productCatalogService.getCatalog({
        filters: { search, categoryIds, minPrice, maxPrice, minRating },
        pagination: { page, perPage },
        sort: { sortBy, sortOrder },
      });

    return {
      data: ProductCatalogMapper.toResponseList(data),
      ...restCatalog,
    };
  }

  @Get('/:id')
  async getProduct(@Param('id') id: number): Promise<ProductResponseDto> {
    console.log('getProduct');

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
