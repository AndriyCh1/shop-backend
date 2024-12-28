import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductReviews1735344840287 implements MigrationInterface {
  name = 'UpdateProductReviews1735344840287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_reviews" RENAME COLUMN "reviewText" TO "comment"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98ba4bbf6e3611d2062b898f5c" ON "cart_items" ("productVariantId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_98ba4bbf6e3611d2062b898f5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" RENAME COLUMN "comment" TO "reviewText"`,
    );
  }
}
