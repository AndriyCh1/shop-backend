import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductVariant } from '#database/entities/product-variants.entity';
import { Product } from '#database/entities/products.entity';
import { ProductVariantsController } from '#modules/products/product-variants.controller';
import { ProductsController } from '#modules/products/products.controller';
import { ProductVariantsService } from '#modules/products/services/product-variants.service';
import { ProductsService } from '#modules/products/services/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductVariant])],
  controllers: [ProductsController, ProductVariantsController],
  providers: [ProductsService, ProductVariantsService],
})
export class ProductsModule {}
