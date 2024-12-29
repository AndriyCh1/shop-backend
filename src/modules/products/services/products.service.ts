import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';
import { ProductGallery } from '#database/entities/product-variant-gallery.entity';
import { Product } from '#database/entities/products.entity';
import { ProductNotFoundException } from '#modules/products/exceptions/product.exception';
import {
  CreateProductData,
  UpdateProductData,
} from '#modules/products/interfaces/product.interface';
import { ProductVariantsService } from '#modules/products/services/product-variants.service';
import { S3Service } from '#providers/s3/s3.service';
import { File } from '#shared/interfaces/file.interface';
import {
  buildCloudfrontUrl,
  removeCloudfrontDomain,
} from '#shared/utils/build-cloudfront-url.util';

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
    private readonly productVariantsService: ProductVariantsService,
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
      .set({
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
      })
      .where({ id })
      .returning('*')
      .execute();

    const updatedProduct = updateResult.raw[0];

    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }

    if (payload.categoryIds?.length) {
      const existingProductCategories =
        await this.productCategoriesRepository.find({
          where: { product: { id } },
        });

      const categoryIdsToCreate: ProductCategory['id'][] = [];

      payload.categoryIds.forEach((categoryId) => {
        const existing = existingProductCategories.some(
          (existingCategory) => existingCategory.categoryId === categoryId,
        );

        if (!existing) {
          categoryIdsToCreate.push(categoryId);
        }
      });

      await this.productCategoriesRepository.delete({
        product: { id },
        categoryId: Not(In(payload.categoryIds)),
      });

      await this.productCategoriesRepository.save(
        categoryIdsToCreate.map((categoryId) => ({
          product: { id },
          category: { id: categoryId },
        })),
      );
    }

    return updateResult.raw[0];
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['productGallery'],
    });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    await this.productVariantsService.removeVariantsByProductId(id);
    await this.removeProductImages(product);
    await this.productsRepository.delete(id);
  }

  private async removeProductImages(product: Product): Promise<void> {
    const deleteS3ImagesPromises = product.productGallery.map((galleryItem) => {
      return this.s3Service.removeObject(
        this.bucketName,
        removeCloudfrontDomain(galleryItem.image),
      );
    });

    const deleteS3ImagesResult = await Promise.allSettled(
      deleteS3ImagesPromises,
    );

    deleteS3ImagesResult.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to delete product images from S3: ${result.reason}`,
        );
      }
    });
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
