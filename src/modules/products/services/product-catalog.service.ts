import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { OrderItem } from '#database/entities/order-items.entity';
import {
  OrderStatus,
  OrderStatusEnum,
} from '#database/entities/order-statuses.entity';
import { Product } from '#database/entities/products.entity';
import {
  GetBestSellersOptions,
  GetCatalogOptions,
  GetNewArrivalsOptions,
  ProductCatalogEntity,
} from '#modules/products/interfaces/catalog.interface';
import { Paginated } from '#shared/interfaces/pagination.interface';
import { limitNumber } from '#shared/utils/numbers';
import { Paginate } from '#shared/utils/paginate.util';
import { countOver } from '#shared/utils/sql.util';

@Injectable()
export class ProductCatalogService {
  private readonly logger = new Logger(ProductCatalogService.name);
  private readonly catalogPageSize = 20;
  private readonly bestSellersPageSize = 10;
  private readonly maximumPageSize = 100;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusesRepository: Repository<OrderStatus>,
  ) {}

  // TODO: Return an array of images for each product
  async getCatalog(
    options: GetCatalogOptions = {},
  ): Promise<Paginated<ProductCatalogEntity>> {
    const page = options.pagination?.page || 1;

    const perPage = limitNumber(
      options.pagination?.perPage || this.catalogPageSize,
      this.maximumPageSize,
    );

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

  public getNewArrivals(
    options: GetNewArrivalsOptions = {},
  ): Promise<Paginated<ProductCatalogEntity>> {
    return this.getCatalog({
      sort: { sortBy: 'createdAt', sortOrder: 'DESC' },
      pagination: options.pagination,
      filters: { minRating: 4 },
    });
  }

  public async getBestSellers(
    options: GetBestSellersOptions = {},
  ): Promise<Paginated<ProductCatalogEntity>> {
    const page = options.pagination?.page || 1;

    const perPage = limitNumber(
      options.pagination?.perPage || this.catalogPageSize,
      this.maximumPageSize,
    );

    const paidStatus = await this.orderStatusesRepository.findOne({
      where: { statusName: OrderStatusEnum.PAID },
    });

    const topProducts = await this.orderItemsRepository
      .createQueryBuilder('oi')
      .innerJoin('oi.order', 'o')
      .innerJoin('oi.productVariant', 'pv')
      .innerJoin('pv.product', 'p')
      .where('o.orderStatus = :status', { status: paidStatus.id })
      .andWhere('p.rating >= :minRating', {
        minRating: options.filters?.minRating || 4,
      })
      .andWhere('o."createdAt" > NOW() - INTERVAL \'1 months\'')
      .groupBy('pv."productId"')
      .select(['pv."productId" AS "productId"', countOver('totalCount')])
      .orderBy('SUM(oi.quantity)', 'DESC')
      .offset(perPage * (page - 1))
      .limit(perPage)
      .getRawMany<{ productId: number; totalCount: number }>();

    if (topProducts.length === 0) {
      return new Paginate({ data: [], page, perPage, total: 0 });
    }

    const topProductsDetails = await this.getCatalogQueryBase()
      .where('p.id IN (:...productIds)', {
        productIds: topProducts.map((p) => p.productId),
      })
      .getRawMany();

    return new Paginate({
      data: topProductsDetails,
      page,
      perPage,
      total: topProducts[0].totalCount,
    });
  }

  private getCatalogQueryBase(
    options: GetCatalogOptions = {},
  ): SelectQueryBuilder<Product> {
    return this.productsRepository
      .createQueryBuilder('p')
      .leftJoin(
        (qb) => this.attachVariantSubquery(qb, options),
        'first_variant',
        '"first_variant"."productId" = "p"."id" AND "first_variant"."row_num" = 1',
      )
      .leftJoin(
        'product_gallery',
        'pg',
        'pg.productId = p.id AND pg.image IS NOT NULL AND pg."productVariantId" IS NULL',
      )
      .select([
        'p.id AS id',
        'first_variant."variantId" AS "variantId"',
        'first_variant."salePrice" AS "salePrice"',
        'first_variant."comparedPrice" AS "comparedPrice"',
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
        'p.id, "variantId", first_variant.image, first_variant."salePrice", first_variant."comparedPrice"',
      );
  }

  private attachVariantSubquery(
    query: SelectQueryBuilder<Product>,
    options: GetCatalogOptions = {},
  ): SelectQueryBuilder<ObjectLiteral> {
    const subquery = query
      .leftJoin(
        'product_gallery',
        'pg',
        'pg."productVariantId" = pv.id AND pg.image IS NOT NULL',
      )
      .select([
        'pv.id AS "variantId"',
        'pv."salePrice" AS "salePrice"',
        'pv."comparedPrice" AS "comparedPrice"',
        'pv."productId" AS "productId"',
        'pg.image AS image',
        `ROW_NUMBER() OVER (PARTITION BY pv."productId" ORDER BY pv."salePrice" ASC) AS "row_num"`,
      ])
      .from('product_variants', 'pv');

    if (options?.filters?.minPrice) {
      subquery.andWhere('pv."salePrice" >= :minPrice', {
        minPrice: options.filters.minPrice,
      });
    }

    if (options?.filters?.maxPrice) {
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
    if (options.filters?.categoryIds?.length) {
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
