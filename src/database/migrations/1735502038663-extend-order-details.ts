import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendOrderDetails1735502038663 implements MigrationInterface {
  name = 'ExtendOrderDetails1735502038663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "shippingAddressId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "productName" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "productVariantName" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "productVariantSku" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "customerFirstName" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "customerLastName" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "phoneNumber" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "addressLine1" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "addressLine2" text`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "country" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "city" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "state" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "postalCode" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "postalCode"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "addressLine2"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "addressLine1"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "customerLastName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "customerFirstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "productVariantSku"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "productVariantName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "productName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "shippingAddressId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
