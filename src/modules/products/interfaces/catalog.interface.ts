import { PaginationOptions } from '#shared/interfaces/pagination.interface';

type FilterOptions = {
  search?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

type SortOptions = {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type GetCatalogOptions = {
  pagination?: PaginationOptions;
  filters?: FilterOptions;
  sort?: SortOptions;
};

export interface ProductCatalogEntity {
  id: number;
  name: string;
  variantId: number;
  salePrice: number;
  description: string;
  shortDescription: string | null;
  rating: number;
  cumulativeRatingSum: number;
  reviewCount: number;
  image: string | null;
  createdAt: Date;
  totalCount: number;
}
