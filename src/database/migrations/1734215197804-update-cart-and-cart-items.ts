import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCartAndCartItems1734215197804 implements MigrationInterface {
  name = 'UpdateCartAndCartItems1734215197804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" RENAME COLUMN "productId" TO "productVariantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" RENAME COLUMN "productVariantId" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
