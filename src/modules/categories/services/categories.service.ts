import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '#database/entities/categories.entity';
import { CategoryResponseDto } from '#modules/categories/dtos/response/category-response.dto';
import {
  CategoryAlreadyExistsException,
  CategoryNotFoundException,
} from '#modules/categories/exceptions/category.exceptions';
import {
  CreateCategoryData,
  UpdateCategoryData,
} from '#modules/categories/interfaces/categories.interface';
import { CategoryMapper } from '#modules/categories/mappers/categories.mapper';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return CategoryMapper.toResponseList(
      await this.categoriesRepository.find(),
    );
  }

  async getCategory(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return CategoryMapper.toResponse(category);
  }

  async createCategory(
    categoryData: CreateCategoryData,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne({
      where: { name: categoryData.name },
    });

    if (category) {
      throw new CategoryAlreadyExistsException(categoryData.name);
    }

    const categoryInstance = this.categoriesRepository.create(categoryData);

    return CategoryMapper.toResponse(
      await this.categoriesRepository.save(categoryInstance),
    );
  }

  async updateCategory(
    id: number,
    newData: UpdateCategoryData,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne({
      where: { name: newData.name },
    });

    if (category) {
      throw new CategoryAlreadyExistsException(newData.name);
    }

    const updateResult = await this.categoriesRepository
      .createQueryBuilder()
      .update(Category)
      .set(newData)
      .where({ id })
      .returning('*')
      .execute();

    const updatedCategory = updateResult.raw[0];

    if (!updatedCategory) {
      throw new CategoryNotFoundException(id);
    }

    return CategoryMapper.toResponse(updatedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    const deletionResult = await this.categoriesRepository.delete(id);

    if (deletionResult.affected === 0) {
      throw new CategoryNotFoundException(id);
    }
  }
}
