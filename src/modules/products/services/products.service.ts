import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';
import { ProductGallery } from '#database/entities/product-variant-gallery.entity';
import { Product } from '#database/entities/products.entity';
import { ProductNotFoundException } from '#modules/products/exceptions/product.exception';
import {
  CreateProductData,
  UpdateProductData,
} from '#modules/products/interfaces/product.interface';
import { S3Service } from '#providers/s3/s3.service';
import { File } from '#shared/interfaces/file.interface';
import { buildCloudfrontUrl } from '#shared/utils/build-cloudfront-url.util';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly bucketName: string;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductGallery)
    private readonly productGalleryRepository: Repository<ProductGallery>,
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }

  async getProductsByCategoryId(id: number): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: { productCategories: { category: { id } } },
      relations: ['productCategories'],
    });

    return products;
  }

  async createProduct(payload: CreateProductData): Promise<Product> {
    const { categoryIds, images, ...restPayload } = payload;

    const savedProduct = await this.productsRepository.save(
      this.productsRepository.create(restPayload),
    );

    if (categoryIds.length) {
      const productCategories = categoryIds.map((categoryId) =>
        this.productCategoriesRepository.create({
          product: savedProduct,
          category: { id: categoryId },
        }),
      );

      try {
        await this.productCategoriesRepository.save(productCategories);
      } catch (error) {
        this.logger.error(error);
      }
    }

    if (images) {
      try {
        await this.uploadProductImages(savedProduct.id, images);
      } catch (error) {
        this.logger.error(error);
      }
    }

    return savedProduct;
  }

  async updateProduct(
    id: number,
    payload: UpdateProductData,
  ): Promise<Product> {
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

    return updateResult.raw[0];
  }

  async removeProduct(id: number): Promise<void> {
    const deleteResult = await this.productsRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new ProductNotFoundException(id);
    }
  }

  async uploadProductImages(
    productId: number,
    images: File[],
  ): Promise<ProductGallery[]> {
    const uploadToS3Promises = images.map(async (image) => {
      const fileName = randomUUID();

      await this.s3Service.putObject(
        this.bucketName,
        fileName,
        image.buffer,
        image.mimetype,
      );

      return fileName;
    });

    const imageNames = await Promise.all(uploadToS3Promises);

    const productGallery = imageNames.map((image) =>
      this.productGalleryRepository.create({
        product: { id: productId },
        image: buildCloudfrontUrl(image),
      }),
    );

    return this.productGalleryRepository.save(productGallery);
  }
}
