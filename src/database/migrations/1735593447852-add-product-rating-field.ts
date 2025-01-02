import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductRatingField1735593447852 implements MigrationInterface {
  name = 'AddProductRatingField1735593447852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "rating" numeric NOT NULL DEFAULT '0'`,
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_product_review_stats()
      RETURNS TRIGGER AS $$
      BEGIN
      -- Handle INSERT
      IF TG_OP = 'INSERT' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" + NEW.rating,
              "reviewCount" = "reviewCount" + 1,
              "rating" = ("cumulativeRatingSum" + NEW.rating) / ("reviewCount" + 1)
          WHERE id = NEW."productId";
      END IF;

      -- Handle DELETE
      IF TG_OP = 'DELETE' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" - OLD.rating,
              "reviewCount" = "reviewCount" - 1,
              "rating" = ("cumulativeRatingSum" - OLD.rating) / ("reviewCount" - 1)
          WHERE id = OLD."productId";
      END IF;

      -- Handle UPDATE
      IF TG_OP = 'UPDATE' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" - OLD.rating + NEW.rating,
              "rating" = ("cumulativeRatingSum" - OLD.rating + NEW.rating) / "reviewCount"
          WHERE id = NEW."productId";
      END IF;

      RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_product_review_stats()
      RETURNS TRIGGER AS $$
      BEGIN
      -- Handle INSERT
      IF TG_OP = 'INSERT' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" + NEW.rating,
              "reviewCount" = "reviewCount" + 1
          WHERE id = NEW."productId";
      END IF;

      -- Handle DELETE
      IF TG_OP = 'DELETE' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" - OLD.rating,
              "reviewCount" = "reviewCount" - 1
          WHERE id = OLD."productId";
      END IF;

      -- Handle UPDATE
      IF TG_OP = 'UPDATE' THEN
          UPDATE products
          SET
              "cumulativeRatingSum" = "cumulativeRatingSum" - OLD.rating + NEW.rating
          WHERE id = NEW."productId";
      END IF;

      RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
  }
}
