import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';
import { Product } from '#database/entities/products.entity';
import { ProductResponseDto } from '#modules/products/dtos/response/product-response.dto';
import {
  FailedToCreateProductException,
  ProductNotFoundException,
} from '#modules/products/exceptions/product.exception';
import {
  CreateProductData,
  UpdateProductData,
} from '#modules/products/interfaces/product.interface';
import { ProductMapper } from '#modules/products/mappers/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  async getAllProducts(): Promise<ProductResponseDto[]> {
    return ProductMapper.toResponseList(await this.productsRepository.find());
  }

  async getProduct(id: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return ProductMapper.toResponse(product);
  }

  async getProductsByCategoryId(id: number): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find({
      where: { productCategories: { category: { id } } },
      relations: ['productCategories'],
    });

    return ProductMapper.toResponseList(products);
  }

  async createProduct(payload: CreateProductData): Promise<ProductResponseDto> {
    let savedProduct: Product;

    try {
      savedProduct = await this.dataSource.transaction(async (manager) => {
        const { categoryIds, ...restPayload } = payload;

        const savedProduct = await manager
          .getRepository(Product)
          .save(manager.getRepository(Product).create(restPayload));

        if (categoryIds.length) {
          const productCategories = categoryIds.map((categoryId) =>
            manager.getRepository(ProductCategory).create({
              product: savedProduct,
              category: { id: categoryId },
            }),
          );

          await manager.getRepository(ProductCategory).save(productCategories);
        }

        return savedProduct;
      });
    } catch (error) {
      this.logger.error(error);
      throw new FailedToCreateProductException();
    }

    return ProductMapper.toResponse(savedProduct);
  }

  async updateProduct(
    id: number,
    payload: UpdateProductData,
  ): Promise<ProductResponseDto> {
    const updateResult = await this.productsRepository
      .createQueryBuilder()
      .update(Product)
      .set(payload)
      .where({ id })
      .returning('*')
      .execute();

    const updatedProduct = updateResult.raw[0];

    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }

    return ProductMapper.toResponse(updateResult.raw[0]);
  }

  async removeProduct(id: number): Promise<void> {
    const deleteResult = await this.productsRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new ProductNotFoundException(id);
    }
  }
}
