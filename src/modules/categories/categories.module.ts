import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '#database/entities/categories.entity';
import { CategoryParent } from '#database/entities/category-parents.entity';
import { CategoriesService } from '#modules/categories/services/categories.service';

import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryParent])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
