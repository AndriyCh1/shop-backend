import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategory } from '#database/entities/product-categories.entity';
import { ProductGallery } from '#database/entities/product-variant-gallery.entity';
import { ProductVariant } from '#database/entities/product-variants.entity';
import { Product } from '#database/entities/products.entity';
import { ProductVariantsController } from '#modules/products/product-variants.controller';
import { ProductsController } from '#modules/products/products.controller';
import { ProductCatalogService } from '#modules/products/services/product-catalog.service';
import { ProductVariantsService } from '#modules/products/services/product-variants.service';
import { ProductsService } from '#modules/products/services/products.service';
import { S3Module } from '#providers/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductGallery,
      ProductCategory,
    ]),
    S3Module,
  ],
  controllers: [ProductsController, ProductVariantsController],
  providers: [ProductsService, ProductVariantsService, ProductCatalogService],
})
export class ProductsModule {}
