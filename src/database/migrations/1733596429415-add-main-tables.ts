import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMainTables1733596429415 implements MigrationInterface {
  name = 'AddMainTables1733596429415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" text NOT NULL, "salePrice" numeric NOT NULL DEFAULT '0', "description" text NOT NULL, "shortDescription" character varying(165) NOT NULL, "note" text, "previewImage" text NOT NULL, "cumulativeRatingSum" integer NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'seller', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "active" boolean NOT NULL DEFAULT true, "role" "public"."users_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wishlist" ("id" SERIAL NOT NULL, "userId" integer, "productId" integer, CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6eeb74a295e2aad03b76b0ba8" ON "wishlist" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17e00e49d77ccaf7ff0e14de37" ON "wishlist" ("productId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "name" text, "description" text, "shortDescription" character varying(165), "note" text, "sku" character varying(255) NOT NULL, "sequenceNumber" integer NOT NULL, "salePrice" numeric, "stockQuantity" integer NOT NULL DEFAULT '0', "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer NOT NULL, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f515690c571a03400a9876600b" ON "product_variants" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_209c835fe7f2ef21187a589f1c" ON "product_variants" ("attributes") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_addresses" ("id" SERIAL NOT NULL, "addressLine1" text NOT NULL, "addressLine2" text, "phoneNumber" character varying(255), "country" character varying(255) NOT NULL, "postalCode" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_781afdedafe920f331f6229cb6" ON "user_addresses" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_statuses" ("id" SERIAL NOT NULL, "statusName" character varying(255) NOT NULL, "color" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_94a06dade8bd0cc8cb2e73484df" UNIQUE ("statusName"), CONSTRAINT "PK_76c6dc5bccb3ef1a4a8510cab3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "orderDeliveredCarrierDate" TIMESTAMP, "orderDeliveredUserDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "orderStatusId" integer, "shippingAddressId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20b3eb7c96605f814cc86a916b" ON "orders" ("orderStatusId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_reviews" ("id" SERIAL NOT NULL, "rating" smallint NOT NULL, "reviewText" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "CHK_92a3c62e2d94207664028bc6df" CHECK ("rating" >= 1 AND "rating" <= 5), CONSTRAINT "PK_67c1501aea1b0633ec441b00bd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32edd80d91dff1bc19e79c8f16" ON "product_reviews" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_964f13abf796aca25d7e5849c6" ON "product_reviews" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variant_gallery" ("id" SERIAL NOT NULL, "image" text NOT NULL, "isPrimary" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productVariantId" integer NOT NULL, CONSTRAINT "PK_fd738ec80bbe5316f0012c21107" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4701570cb624d78cd8ff479d5f" ON "product_variant_gallery" ("productVariantId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "isRoot" boolean NOT NULL DEFAULT false, "isLeaf" boolean NOT NULL DEFAULT false, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_categories" ("id" SERIAL NOT NULL, "productId" integer, "categoryId" integer, CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6156a79599e274ee9d83b1de13" ON "product_categories" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fdef3adba0c284fd103d0fd369" ON "product_categories" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "countries" ("id" SERIAL NOT NULL, "iso" character(2) NOT NULL, "name" character varying(80) NOT NULL, "upperName" character varying(80) NOT NULL, "iso3" character(3), "numCode" smallint, "phoneCode" integer NOT NULL, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "price" numeric NOT NULL, "quantity" integer NOT NULL, "total" numeric NOT NULL, "orderId" integer, "productVariantId" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1d359a55923bb45b057fbdab0" ON "order_items" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9cf6578d9f8c7f43cc96c7af6d" ON "order_items" ("productVariantId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "allowed_attributes" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "type" character varying(50) NOT NULL, "description" character varying(256), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a08af47ae83b372fc97dde19cc" UNIQUE ("name"), CONSTRAINT "PK_732b413eb4ac0ed3f491daa2186" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_attributes" ("id" SERIAL NOT NULL, "categoryId" integer, "attributeId" integer, CONSTRAINT "PK_f58b128e30a1ad029b32fb79624" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38209e8493459f8b98aa107be2" ON "category_attributes" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4eeba7ff3f73d77a0884341456" ON "category_attributes" ("attributeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category_parents" ("categoryId" integer NOT NULL, "parentId" integer NOT NULL, CONSTRAINT "CHK_666f2afb8cacdfe7c510d23193" CHECK ("parentId" <> "categoryId"), CONSTRAINT "PK_d97b4c297d07142b3289ab85859" PRIMARY KEY ("categoryId", "parentId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_257ecc76e3be92fbfb676f7329" ON "category_parents" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "carts" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69828a178f152f157dcf2f70a8" ON "carts" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "allowed_attribute_values" ("id" SERIAL NOT NULL, "valueString" character varying(256), "valueNumber" numeric, "rangeMin" numeric, "rangeMax" numeric, "colorHex" character varying(10), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" integer NOT NULL, CONSTRAINT "CHK_f7881ab4394fa1938626bb86c9" CHECK ("rangeMax" > "rangeMin"), CONSTRAINT "PK_28fc42a3b63382475ed9fe60175" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5556a86982f11e0658152de921" ON "allowed_attribute_values" ("attributeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cartId" integer NOT NULL, "productId" integer, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_edd714311619a5ad0952504583" ON "cart_items" ("cartId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_17e00e49d77ccaf7ff0e14de37b" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_781afdedafe920f331f6229cb62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_20b3eb7c96605f814cc86a916be" FOREIGN KEY ("orderStatusId") REFERENCES "order_statuses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_32edd80d91dff1bc19e79c8f16d" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_964f13abf796aca25d7e5849c64" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_gallery" ADD CONSTRAINT "FK_4701570cb624d78cd8ff479d5fc" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_38209e8493459f8b98aa107be2b" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_4eeba7ff3f73d77a0884341456e" FOREIGN KEY ("attributeId") REFERENCES "allowed_attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" ADD CONSTRAINT "FK_257ecc76e3be92fbfb676f73294" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" ADD CONSTRAINT "FK_e08848e7579781a9a2db11d3b0f" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allowed_attribute_values" ADD CONSTRAINT "FK_5556a86982f11e0658152de9216" FOREIGN KEY ("attributeId") REFERENCES "allowed_attributes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allowed_attribute_values" DROP CONSTRAINT "FK_5556a86982f11e0658152de9216"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" DROP CONSTRAINT "FK_e08848e7579781a9a2db11d3b0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parents" DROP CONSTRAINT "FK_257ecc76e3be92fbfb676f73294"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_4eeba7ff3f73d77a0884341456e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_38209e8493459f8b98aa107be2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9cf6578d9f8c7f43cc96c7af6d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_gallery" DROP CONSTRAINT "FK_4701570cb624d78cd8ff479d5fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_964f13abf796aca25d7e5849c64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_32edd80d91dff1bc19e79c8f16d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_20b3eb7c96605f814cc86a916be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_781afdedafe920f331f6229cb62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_17e00e49d77ccaf7ff0e14de37b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_edd714311619a5ad0952504583"`,
    );
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5556a86982f11e0658152de921"`,
    );
    await queryRunner.query(`DROP TABLE "allowed_attribute_values"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_69828a178f152f157dcf2f70a8"`,
    );
    await queryRunner.query(`DROP TABLE "carts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_257ecc76e3be92fbfb676f7329"`,
    );
    await queryRunner.query(`DROP TABLE "category_parents"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4eeba7ff3f73d77a0884341456"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_38209e8493459f8b98aa107be2"`,
    );
    await queryRunner.query(`DROP TABLE "category_attributes"`);
    await queryRunner.query(`DROP TABLE "allowed_attributes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cf6578d9f8c7f43cc96c7af6d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1d359a55923bb45b057fbdab0"`,
    );
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "countries"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fdef3adba0c284fd103d0fd369"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6156a79599e274ee9d83b1de13"`,
    );
    await queryRunner.query(`DROP TABLE "product_categories"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4701570cb624d78cd8ff479d5f"`,
    );
    await queryRunner.query(`DROP TABLE "product_variant_gallery"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_964f13abf796aca25d7e5849c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32edd80d91dff1bc19e79c8f16"`,
    );
    await queryRunner.query(`DROP TABLE "product_reviews"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20b3eb7c96605f814cc86a916b"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "order_statuses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_781afdedafe920f331f6229cb6"`,
    );
    await queryRunner.query(`DROP TABLE "user_addresses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_209c835fe7f2ef21187a589f1c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f515690c571a03400a9876600b"`,
    );
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17e00e49d77ccaf7ff0e14de37"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6eeb74a295e2aad03b76b0ba8"`,
    );
    await queryRunner.query(`DROP TABLE "wishlist"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
