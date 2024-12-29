import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeDeleteVariantImages1735432191741
  implements MigrationInterface
{
  name = 'CascadeDeleteVariantImages1735432191741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" DROP CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ALTER COLUMN "productId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ALTER COLUMN "categoryId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" ADD CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_gallery" DROP CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ALTER COLUMN "categoryId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ALTER COLUMN "productId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_gallery" ADD CONSTRAINT "FK_4fe1b9a91cf08abfbb860f1644d" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
