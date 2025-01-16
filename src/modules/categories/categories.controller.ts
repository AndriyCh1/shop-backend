import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateCategoryDto } from '#modules/categories/dtos/request/create-category.dto';
import { UpdateCategoryDto } from '#modules/categories/dtos/request/update-category.dto';
import {
  CategoryHierarchyItemResponseDto,
  CategoryResponseDto,
} from '#modules/categories/dtos/response/category-response.dto';
import { CategoryNotFoundException } from '#modules/categories/exceptions/category.exceptions';
import { CategoryMapper } from '#modules/categories/mappers/categories.mapper';
import { CategoriesService } from '#modules/categories/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return CategoryMapper.toResponseList(
      await this.categoriesService.getAllCategories(),
    );
  }

  @Get('/hierarchy')
  async getAllNestedCategories(): Promise<CategoryHierarchyItemResponseDto[]> {
    return CategoryMapper.toHierarchyResponse(
      await this.categoriesService.getCategoriesHierarchy(),
    );
  }

  @Get('/:id')
  async getCategory(@Param('id') id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.getCategory(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return CategoryMapper.toResponse(category);
  }

  @Get('/hierarchy/:id')
  async getOneCategoryHierarchy(
    @Param('id') id: number,
  ): Promise<CategoryHierarchyItemResponseDto[]> {
    return CategoryMapper.toHierarchyResponse(
      await this.categoriesService.getCategoriesHierarchy({ id }),
    );
  }

  @Post()
  async createCategory(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.createCategory(dto);

    return CategoryMapper.toResponse(category);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return CategoryMapper.toResponse(
      await this.categoriesService.updateCategory(id, dto),
    );
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }
}
