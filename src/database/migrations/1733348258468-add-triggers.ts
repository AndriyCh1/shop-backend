import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTriggers1733348258468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_categories_circular_dependency()
      RETURNS TRIGGER AS $$
      DECLARE
          is_circular BOOLEAN;
      BEGIN
          -- Recursive query to detect circular dependency
          WITH RECURSIVE ancestor_path AS (
              SELECT parent_id AS ancestor
              FROM category_parents
              WHERE category_id = NEW.parent_id
              UNION ALL
              SELECT cp.parent_id
              FROM category_parents cp
              INNER JOIN ancestor_path ap ON cp.category_id = ap.ancestor
          )
          SELECT EXISTS (
              SELECT 1
              FROM ancestor_path
              WHERE ancestor = NEW.category_id
          ) INTO is_circular;

          -- If a circular dependency is detected, raise an exception
          IF is_circular THEN
              RAISE EXCEPTION 'Circular dependency detected for category_id %. Parent_id: %', NEW.category_id, NEW.parent_id;
          END IF;

          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_prevent_categories_circular_dependency
      BEFORE INSERT OR UPDATE ON category_parents
      FOR EACH ROW
      EXECUTE FUNCTION check_categories_circular_dependency();
  `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_product_review_stats()
      RETURNS TRIGGER AS $$
      BEGIN
      -- Handle INSERT
      IF TG_OP = 'INSERT' THEN
          UPDATE products
          SET
              cumulative_rating_sum = cumulative_rating_sum + NEW.rating,
              review_count = review_count + 1
          WHERE id = NEW.product_id;
      END IF;

      -- Handle DELETE
      IF TG_OP = 'DELETE' THEN
          UPDATE products
          SET
              cumulative_rating_sum = cumulative_rating_sum - OLD.rating,
              review_count = review_count - 1
          WHERE id = OLD.product_id;
      END IF;

      -- Handle UPDATE
      IF TG_OP = 'UPDATE' THEN
          UPDATE products
          SET
              cumulative_rating_sum = cumulative_rating_sum - OLD.rating + NEW.rating
          WHERE id = NEW.product_id;
      END IF;

      RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      -- Attach the trigger to the product_reviews table
      CREATE TRIGGER trigger_update_product_review_stats
      AFTER INSERT OR UPDATE OR DELETE ON product_reviews
      FOR EACH ROW
      EXECUTE FUNCTION update_product_review_stats();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER trigger_prevent_categories_circular_dependency ON category_parents;`,
    );
    await queryRunner.query(
      `DROP FUNCTION check_categories_circular_dependency;`,
    );

    await queryRunner.query(
      `DROP TRIGGER trigger_update_product_review_stats;`,
    );
    await queryRunner.query(`DROP FUNCTION update_product_review_stats;`);
  }
}
