import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesAndConstraints1733351339918
  implements MigrationInterface
{
  name = 'AddIndexesAndConstraints1733351339918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_512bf776587ad5fc4f804277d7" ON "wishlist" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16f64e06715ce4fea8257cc42c" ON "wishlist" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6343513e20e2deab45edfce131" ON "product_variants" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_209c835fe7f2ef21187a589f1c" ON "product_variants" ("attributes") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f6007ae2a91b6454d2f9be966" ON "product_variant_gallery" ("product_variant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a5100ce0548ef27a6f1533a5c" ON "user_addresses" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f51b75ebdfdef60d264f982a60" ON "orders" ("order_status_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8748b4a0e8de6d266f2bbc877f" ON "product_categories" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9148da8f26fc248e77a387e311" ON "product_categories" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d3fbb451c2b63d0a763f3ff5b" ON "product_reviews" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8306941b81cb5be7d521bdc083" ON "product_reviews" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_145532db85752b29c57d2b7b1f" ON "order_items" ("order_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_11836543386b9135a47d54cab7" ON "order_items" ("product_variant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55050a8a1b2d2f5202f226d4ac" ON "category_attributes" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6730826326fa81ff5511cb0981" ON "category_attributes" ("attribute_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ec1c94a977b940d85a4f498ae" ON "carts" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6385a745d9e12a89b859bb2562" ON "cart_items" ("cart_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e1862c8157087c03c16c4d1a1" ON "category_parents" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc12aaa68449a240d47dc2ffbb" ON "allowed_attribute_values" ("attribute_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" ADD CONSTRAINT "CHK_e29efc4bbf8f6d6bb0b8c6734c" CHECK (rating >= 1 AND rating <= 5)`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" ADD CONSTRAINT "CHK_088f25112deb74df7aea74f863" CHECK (parent_id <> category_id)`,
    );
    await queryRunner.query(
      `ALTER TABLE "allowed_attribute_values" ADD CONSTRAINT "CHK_3c11097e653b89ec800649a402" CHECK (range_max > range_min)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "allowed_attribute_values" DROP CONSTRAINT "CHK_3c11097e653b89ec800649a402"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" DROP CONSTRAINT "CHK_088f25112deb74df7aea74f863"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" DROP CONSTRAINT "CHK_e29efc4bbf8f6d6bb0b8c6734c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc12aaa68449a240d47dc2ffbb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e1862c8157087c03c16c4d1a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6385a745d9e12a89b859bb2562"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ec1c94a977b940d85a4f498ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6730826326fa81ff5511cb0981"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55050a8a1b2d2f5202f226d4ac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11836543386b9135a47d54cab7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_145532db85752b29c57d2b7b1f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8306941b81cb5be7d521bdc083"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1d3fbb451c2b63d0a763f3ff5b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9148da8f26fc248e77a387e311"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8748b4a0e8de6d266f2bbc877f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f51b75ebdfdef60d264f982a60"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a5100ce0548ef27a6f1533a5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f6007ae2a91b6454d2f9be966"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_209c835fe7f2ef21187a589f1c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6343513e20e2deab45edfce131"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_16f64e06715ce4fea8257cc42c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_512bf776587ad5fc4f804277d7"`,
    );
  }
}
