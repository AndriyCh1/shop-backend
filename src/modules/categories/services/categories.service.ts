import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Category } from '#database/entities/categories.entity';
import {
  CategoryAlreadyExistsException,
  CategoryNotFoundException,
} from '#modules/categories/exceptions/category.exceptions';
import {
  CategoryHierarchy,
  CreateCategoryData,
  UpdateCategoryData,
} from '#modules/categories/interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategory(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async getCategoriesHierarchy({ id }: { id?: number } = {}): Promise<
    CategoryHierarchy[]
  > {
    const whereClause = id ? `WHERE id = $1` : 'WHERE "parentId" IS NULL';
    const getCategoryHierarchyQuery = `
      WITH RECURSIVE category_hierarchy AS (
          SELECT c.*, 1 AS depth
          FROM categories c
          ${whereClause}
          UNION ALL
          SELECT c.*, ch.depth + 1
          FROM categories c
          INNER JOIN category_hierarchy ch ON c."parentId" = ch.id
      )
      SELECT * FROM category_hierarchy;
    `;

    return this.dataSource.manager.query<CategoryHierarchy[]>(
      getCategoryHierarchyQuery,
      id ? [id] : [],
    );
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
        parentId: payload.parentId,
      }),
    );

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
        parentId: newData.parentId,
      })
      .where({ id })
      .returning('*')
      .execute();

    const updatedCategory = updateResult.raw[0];

    if (!updatedCategory) {
      throw new CategoryNotFoundException(id);
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
