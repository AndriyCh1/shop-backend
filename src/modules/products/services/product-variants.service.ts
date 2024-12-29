import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import { ProductGallery } from '#database/entities/product-variant-gallery.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { ProductVariantNotFoundException } from '#modules/products/exceptions/product-variant.exceptions';
import {
  CreateProductVariantData,
  UpdateProductVariantData,
} from '#modules/products/interfaces/product-variant.interface';
import { S3Service } from '#providers/s3/s3.service';
import { File } from '#shared/interfaces/file.interface';
import {
  buildCloudfrontUrl,
  removeCloudfrontDomain,
} from '#shared/utils/build-cloudfront-url.util';

@Injectable()
export class ProductVariantsService {
  private readonly logger = new Logger(ProductVariantsService.name);
  private readonly bucketName: string;

  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductGallery)
    private readonly productGalleryRepository: Repository<ProductGallery>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async getAllVariants(): Promise<ProductVariant[]> {
    return this.variantsRepository.find();
  }

  async getVariant(id: number): Promise<ProductVariant> {
    const variant = await this.variantsRepository.findOne({ where: { id } });

    if (!variant) {
      throw new ProductVariantNotFoundException(id);
    }

    return variant;
  }

  async createVariant(
    payload: CreateProductVariantData,
  ): Promise<ProductVariant> {
    const { images, ...restPayload } = payload;

    const createdVariant = await this.variantsRepository.save(
      this.variantsRepository.create(restPayload),
    );

    if (images) {
      try {
        await this.uploadProductVariantImages(
          restPayload.productId,
          createdVariant.id,
          images,
        );
      } catch (error) {
        this.logger.error(error);
      }
    }

    return createdVariant;
  }

  async updateVariant(
    id: number,
    payload: UpdateProductVariantData,
  ): Promise<ProductVariant> {
    const { attributes: payloadAttributes, ...restPayload } = payload;

    const updateResult = await this.variantsRepository
      .createQueryBuilder()
      .update(ProductVariant)
      .set({
        ...restPayload,
        attributes: () =>
          `attributes || '${JSON.stringify(payloadAttributes)}'::jsonb`,
      })
      .where({ id })
      .returning('*')
      .execute();

    const updatedVariant = updateResult.raw[0];

    if (!updatedVariant) {
      throw new ProductVariantNotFoundException(id);
    }

    return updatedVariant;
  }

  async removeVariant(id: number): Promise<void> {
    const variant = await this.variantsRepository.findOne({
      where: { id },
      relations: ['productGallery'],
    });

    if (!variant) {
      throw new ProductVariantNotFoundException(id);
    }

    await this.variantsRepository.delete({ id });
    await this.removeVariantsImages([variant]);
  }

  async removeVariantsByProductId(productId: number): Promise<void> {
    const variants = await this.variantsRepository.find({
      where: { product: { id: productId } },
      relations: ['productGallery'],
    });

    await this.removeVariantsImages(variants);
    await this.variantsRepository.remove(variants);
  }

  private async removeVariantsImages(
    variants: ProductVariant[],
  ): Promise<void> {
    const deleteS3ImagesPromises = variants.flatMap((variant) =>
      variant.productGallery.map((galleryItem) => {
        return this.s3Service.removeObject(
          this.bucketName,
          removeCloudfrontDomain(galleryItem.image),
        );
      }),
    );

    const deleteS3ImagesResult = await Promise.allSettled(
      deleteS3ImagesPromises,
    );

    deleteS3ImagesResult.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to delete product variant images from S3: ${result.reason}`,
        );
      }
    });
  }

  async uploadProductVariantImages(
    productId: number,
    productVariantId: number,
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
        productVariant: { id: productVariantId },
        image: buildCloudfrontUrl(image),
      }),
    );

    return this.productGalleryRepository.save(productGallery);
  }
}
