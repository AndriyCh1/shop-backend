import { randomUUID } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';

import { GeneralDatabaseError } from '#database/database-errors';
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
import { OperationContext } from '#shared/interfaces/operation-context.interface';
import {
  buildCloudfrontUrl,
  removeCloudfrontDomain,
} from '#shared/utils/build-cloudfront-url.util';

// TODO: Implement soft delete for products and their variants
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
    private readonly dataSource: DataSource,
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
    const product = await this.dataSource.transaction(async (entityManager) => {
      const productsRepository = entityManager.getRepository(Product);

      const savedProduct = await productsRepository.save(
        productsRepository.create(restPayload),
      );

      for (const variant of payload.variants) {
        try {
          await this.productVariantsService.createVariant(
            {
              displayOrder: variant.displayOrder,
              salePrice: variant.salePrice,
              comparedPrice: variant.comparedPrice,
              stockQuantity: variant.stockQuantity,
              attributes: variant.attributes,
              name: variant.name,
              description: variant.description,
              shortDescription: variant.shortDescription,
              sku: variant.sku,
              productId: savedProduct.id,
            },
            { entityManager },
          );
        } catch (error) {
          this.logger.error(error);
          throw new GeneralDatabaseError('Failed to create product categories');
        }
      }

      if (categoryIds.length) {
        const productCategoriesRepository =
          entityManager.getRepository(ProductCategory);

        const productCategories = categoryIds.map((categoryId) =>
          productCategoriesRepository.create({
            product: savedProduct,
            category: { id: categoryId },
          }),
        );

        try {
          await productCategoriesRepository.save(productCategories);
        } catch (error) {
          this.logger.error(error.message);
          throw new GeneralDatabaseError('Failed to create product categories');
        }
      }

      if (images) {
        try {
          await this.uploadProductImages(savedProduct.id, images, {
            entityManager,
          });
        } catch (error) {
          this.logger.error(error.message);
          throw new GeneralDatabaseError('Failed to upload product images');
        }
      }

      return savedProduct;
    });

    return product;
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

    await this.s3Service.removeObjects(
      this.bucketName,
      product.productGallery.map((galleryItem) =>
        removeCloudfrontDomain(galleryItem.image),
      ),
    );

    await this.productsRepository.delete(id);
  }

  // private async removeProductImages(product: Product): Promise<void> {
  //   const deleteS3ImagesPromises = product.productGallery.map((galleryItem) => {
  //     return this.s3Service.removeObject(
  //       this.bucketName,
  //       removeCloudfrontDomain(galleryItem.image),
  //     );
  //   });

  //   const deleteS3ImagesResult = await Promise.allSettled(
  //     deleteS3ImagesPromises,
  //   );

  //   deleteS3ImagesResult.forEach((result) => {
  //     if (result.status === 'rejected') {
  //       this.logger.error(
  //         `Failed to delete product images from S3: ${result.reason}`,
  //       );
  //     }
  //   });
  // }

  async uploadProductImages(
    productId: number,
    images: File[],
    ctx?: OperationContext,
  ): Promise<ProductGallery[]> {
    this.logger.debug('productId', productId);
    this.logger.debug('images', images);

    const uploadImages = images.map((image) => ({
      key: randomUUID(),
      body: image.buffer,
      contentType: image.mimetype,
    }));

    this.logger.debug('uploadImages', uploadImages);

    await this.s3Service.putObjects(this.bucketName, uploadImages);

    const productGalleryRepository = ctx?.entityManager
      ? ctx.entityManager.getRepository(ProductGallery)
      : this.productGalleryRepository;

    const productGallery = uploadImages.map((image) =>
      productGalleryRepository.create({
        product: { id: productId },
        image: buildCloudfrontUrl(image.key),
      }),
    );

    try {
      return productGalleryRepository.save(productGallery);
    } catch (error) {
      this.logger.error(error.message);

      await this.s3Service.removeObjects(
        this.bucketName,
        uploadImages.map((image) => image.key),
      );

      throw new GeneralDatabaseError('Failed to save product images');
    }
  }
}
