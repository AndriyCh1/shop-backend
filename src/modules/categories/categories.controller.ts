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
import { CategoryResponseDto } from '#modules/categories/dtos/response/category-response.dto';
import { CategoriesService } from '#modules/categories/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategory(@Param('id') id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.getCategory(id);
  }

  @Post()
  createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.createCategory(dto);
  }

  @Put(':id')
  updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }
}
