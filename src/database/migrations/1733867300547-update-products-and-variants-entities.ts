import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsAndVariantsEntities1733867300547
  implements MigrationInterface
{
  name = 'UpdateProductsAndVariantsEntities1733867300547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_gallery" ("id" SERIAL NOT NULL, "image" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer NOT NULL, "productVariantId" integer, CONSTRAINT "PK_d90bea0e84bb631e5b79ddd4500" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abd44ca89bad56432287275dca" ON "product_gallery" ("productId") `,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "salePrice"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "note"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "previewImage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "note"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "sequenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "comparedPrice" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "displayOrder" smallint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "salePrice" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "sku" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "attributes" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "attributes" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" ADD CONSTRAINT "FK_abd44ca89bad56432287275dca4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" ADD CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_gallery" DROP CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" DROP CONSTRAINT "FK_abd44ca89bad56432287275dca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "attributes" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "attributes" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "sku" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "salePrice" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "name"`,
    );
    await queryRunner.query(`ALTER TABLE "product_variants" ADD "name" text`);
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "name" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "displayOrder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "comparedPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "sequenceNumber" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "product_variants" ADD "note" text`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "previewImage" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "note" text`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "salePrice" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_abd44ca89bad56432287275dca"`,
    );
    await queryRunner.query(`DROP TABLE "product_gallery"`);
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
