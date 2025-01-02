import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '#database/entities/products.entity';
import {
  GetCatalogOptions,
  ProductCatalogEntity,
} from '#modules/products/interfaces/catalog.interface';
import { Paginated } from '#shared/interfaces/pagination.interface';
import { Paginate } from '#shared/utils/paginate.util';
import { countOver } from '#shared/utils/sql.util';

@Injectable()
export class ProductCatalogService {
  private readonly catalogPageSize = 20;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // TODO: Return an array of images for each product
  async getCatalog(
    options: GetCatalogOptions = {},
  ): Promise<Paginated<ProductCatalogEntity[]>> {
    const page = options.pagination?.page || 1;
    const perPage = options.pagination?.perPage || this.catalogPageSize;

    const catalogQueryBase = this.getCatalogQueryBase(options)
      .offset(perPage * (page - 1))
      .limit(perPage);

    this.applyProductFilters(catalogQueryBase, options);

    const catalog = await catalogQueryBase.getRawMany<ProductCatalogEntity>();
    const totalCount = catalog.length > 0 ? catalog[0].totalCount : 0;

    return new Paginate({
      data: catalog,
      total: totalCount,
      page,
      perPage,
    });
  }

  private getCatalogQueryBase(
    options: GetCatalogOptions,
  ): SelectQueryBuilder<Product> {
    return this.productsRepository
      .createQueryBuilder('p')
      .leftJoin(
        (qb) => this.attachVariantSubquery(qb, options),
        'first_variant',
        'first_variant."productId" = p.id',
      )
      .leftJoin(
        'p.productGallery',
        'pg',
        'pg.productId = p.id AND pg.image IS NOT NULL AND pg.productVariantId IS NULL',
      )
      .select([
        'p.id AS id',
        'first_variant."variantId" AS "variantId"',
        'first_variant.price AS "salePrice"',
        'p.name AS name',
        'p.description AS description',
        'p.shortDescription AS "shortDescription"',
        'p.rating AS rating',
        'p.cumulativeRatingSum as "cumulativeRatingSum"',
        'p.reviewCount as "reviewCount"',
        'COALESCE(first_variant.image, MIN(pg.image)) AS image',
        'p.createdAt AS "createdAt"',
      ])
      .addSelect(countOver('totalCount'))
      .groupBy(
        'p.id, first_variant."variantId", first_variant.image, first_variant.price,' +
          'p.name, p.description, p.shortDescription, p.rating, p.cumulativeRatingSum, p.reviewCount, p.createdAt',
      );
  }

  private attachVariantSubquery(
    query: SelectQueryBuilder<Product>,
    options: GetCatalogOptions,
  ): SelectQueryBuilder<ObjectLiteral> {
    const subquery = query
      .leftJoin(
        'product_gallery',
        'pg',
        'pg."productVariantId" = pv.id AND pg.image IS NOT NULL',
      )
      .select([
        'pv.id AS "variantId"',
        'pv."salePrice" AS price',
        'pv."productId" AS "productId"',
        'MIN(pg.image) AS image',
      ])
      .from('product_variants', 'pv')
      .groupBy('pv.id, pv."salePrice", pv."productId"')
      .orderBy('pv."salePrice"', 'ASC')
      .limit(1);

    if (options.filters?.minPrice) {
      subquery.andWhere('pv."salePrice" >= :minPrice', {
        minPrice: options.filters.minPrice,
      });
    }

    if (options.filters?.maxPrice) {
      subquery.andWhere('pv."salePrice" <= :maxPrice', {
        maxPrice: options.filters.maxPrice,
      });
    }

    return subquery;
  }

  private applyProductFilters(
    query: SelectQueryBuilder<Product>,
    options: GetCatalogOptions,
  ): SelectQueryBuilder<ObjectLiteral> {
    if (options.filters?.categoryIds.length) {
      query
        .leftJoin('p.productCategories', 'pc')
        .andWhere('pc."categoryId" IN (:...categoryIds)', {
          categoryIds: options.filters.categoryIds,
        });
    }

    if (options.filters?.search) {
      query.andWhere('p.name ILIKE :search', {
        search: `%${options.filters.search}%`,
      });
    }

    if (options.filters?.minRating) {
      query.andWhere('p.rating >= :minRating', {
        minRating: options.filters.minRating,
      });
    }

    if (options.sort?.sortBy && options.sort?.sortOrder) {
      query.orderBy(`"${options.sort.sortBy}"`, options.sort.sortOrder);
    } else {
      query.orderBy('"createdAt"', 'DESC');
    }

    return query;
  }
}
