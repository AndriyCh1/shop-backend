import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '#database/entities/categories.entity';
import { CategoryParent } from '#database/entities/category-parents.entity';
import {
  CategoryAlreadyExistsException,
  CategoryNotFoundException,
} from '#modules/categories/exceptions/category.exceptions';
import {
  CreateCategoryData,
  UpdateCategoryData,
} from '#modules/categories/interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryParent)
    private readonly categoryParentsRepository: Repository<CategoryParent>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategory(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async createCategory(payload: CreateCategoryData): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { name: payload.name },
    });

    if (category) {
      throw new CategoryAlreadyExistsException(payload.name);
    }

    const createdCategory = await this.categoriesRepository.save(
      this.categoriesRepository.create({
        name: payload.name,
        description: payload.description,
      }),
    );

    if (payload.parentId !== undefined) {
      await this.categoryParentsRepository.save({
        category: { id: createdCategory.id },
        parent: { id: payload.parentId },
      });
    }

    return createdCategory;
  }

  async updateCategory(
    id: number,
    newData: UpdateCategoryData,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { name: newData.name },
    });

    if (category) {
      throw new CategoryAlreadyExistsException(newData.name);
    }

    const updateResult = await this.categoriesRepository
      .createQueryBuilder()
      .update(Category)
      .set({
        name: newData.name,
        description: newData.description,
      })
      .where({ id })
      .returning('*')
      .execute();

    const updatedCategory = updateResult.raw[0];

    if (!updatedCategory) {
      throw new CategoryNotFoundException(id);
    }

    if (newData.parentId !== undefined) {
      await this.categoryParentsRepository.update(
        { category: { id } },
        { parent: { id: newData.parentId } },
      );
    }

    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    const deletionResult = await this.categoriesRepository.delete(id);

    if (deletionResult.affected === 0) {
      throw new CategoryNotFoundException(id);
    }
  }
}
