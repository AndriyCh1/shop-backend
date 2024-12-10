import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductVariant } from '#database/entities/product-variants.entity';
import { ProductVariantNotFoundException } from '#modules/products/exceptions/product-variant.exceptions';
import {
  CreateProductVariantData,
  UpdateProductVariantData,
} from '#modules/products/interfaces/product-variant.interface';
import { ProductVariantMapper } from '#modules/products/mappers/product-variant.mapper';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantsRepository: Repository<ProductVariant>,
  ) {}

  async getAllVariants() {
    return ProductVariantMapper.toResponseList(
      await this.variantsRepository.find(),
    );
  }

  async getVariant(id: number) {
    const variant = await this.variantsRepository.findOne({ where: { id } });

    if (!variant) {
      throw new ProductVariantNotFoundException(id);
    }

    return ProductVariantMapper.toResponse(variant);
  }

  async createVariant(payload: CreateProductVariantData) {
    const variantInstance = this.variantsRepository.create(payload);

    return ProductVariantMapper.toResponse(
      await this.variantsRepository.save(variantInstance),
    );
  }

  async updateVariant(id: number, payload: UpdateProductVariantData) {
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

    return ProductVariantMapper.toResponse(updatedVariant);
  }

  async removeVariant(id: number): Promise<void> {
    const deleteResult = await this.variantsRepository.delete({ id });

    if (!deleteResult.affected) {
      throw new ProductVariantNotFoundException(id);
    }
  }

  // TODO: async addVariantImage(productId: number, variantId: number, image: string): Promise<void> {}
}
