import { MigrationInterface, QueryRunner } from 'typeorm';

export class SelfReferencingCategoriesUpdate1736924779065
  implements MigrationInterface
{
  name = 'SelfReferencingCategoriesUpdate1736924779065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER trigger_prevent_categories_circular_dependency ON category_parents;`,
    );
    await queryRunner.query(
      `DROP FUNCTION check_categories_circular_dependency;`,
    );

    await queryRunner.query('DROP TABLE "category_parents"');
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isRoot"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isLeaf"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "parentId" integer`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "rating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a6f051e66982b5f0318981bca" ON "categories" ("parentId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a6f051e66982b5f0318981bca"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "rating" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "parentId"`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "metadata" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "isLeaf" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "isRoot" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_parents" ("categoryId" integer NOT NULL, "parentId" integer NOT NULL, CONSTRAINT "CHK_666f2afb8cacdfe7c510d23193" CHECK ("parentId" <> "categoryId"), CONSTRAINT "PK_d97b4c297d07142b3289ab85859" PRIMARY KEY ("categoryId", "parentId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_257ecc76e3be92fbfb676f7329" ON "category_parents" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" ADD CONSTRAINT "FK_257ecc76e3be92fbfb676f73294" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" ADD CONSTRAINT "FK_e08848e7579781a9a2db11d3b0f" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION check_categories_circular_dependency()
      RETURNS TRIGGER AS $$
      DECLARE
          is_circular BOOLEAN;
      BEGIN
          -- Recursive query to detect circular dependency
          WITH RECURSIVE ancestor_path AS (
              SELECT "parentId" AS ancestor
              FROM category_parents
              WHERE "categoryId" = NEW."parentId"
              UNION ALL
              SELECT cp."parentId"
              FROM category_parents cp
              INNER JOIN ancestor_path ap ON cp."categoryId" = ap.ancestor
          )
          SELECT EXISTS (
              SELECT 1
              FROM ancestor_path
              WHERE ancestor = NEW."categoryId"
          ) INTO is_circular;

          -- If a circular dependency is detected, raise an exception
          IF is_circular THEN
              RAISE EXCEPTION 'Circular dependency detected for "categoryId" %. "parentId": %', NEW."categoryId", NEW."parentId";
          END IF;

          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_prevent_categories_circular_dependency
      BEFORE INSERT OR UPDATE ON category_parents
      FOR EACH ROW
      EXECUTE FUNCTION check_categories_circular_dependency();
  `);
  }
}
