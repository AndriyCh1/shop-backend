import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMainEntities1733345035545 implements MigrationInterface {
    name = 'AddMainEntities1733345035545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" text NOT NULL, "sale_price" numeric NOT NULL DEFAULT '0', "description" text NOT NULL, "short_description" character varying(165) NOT NULL, "note" text, "preview_image" text NOT NULL, "cumulative_rating_sum" integer NOT NULL DEFAULT '0', "review_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist" ("id" SERIAL NOT NULL, "user_id" integer, "product_id" integer, CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" text NOT NULL, "password_hash" text NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "name" text, "description" text, "short_description" character varying(165), "note" text, "sku" character varying(255) NOT NULL, "sequence_number" integer NOT NULL, "sale_price" numeric, "stock_quantity" integer NOT NULL DEFAULT '0', "attributes" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer NOT NULL, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variant_gallery" ("id" SERIAL NOT NULL, "image" text NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_variant_id" integer NOT NULL, CONSTRAINT "PK_fd738ec80bbe5316f0012c21107" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_addresses" ("id" SERIAL NOT NULL, "address_line1" text NOT NULL, "address_line2" text, "phone_number" character varying(255), "country" character varying(255) NOT NULL, "postal_code" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "is_root" boolean NOT NULL DEFAULT false, "is_leaf" boolean NOT NULL DEFAULT false, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_categories" ("id" SERIAL NOT NULL, "product_id" integer, "category_id" integer, CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_statuses" ("id" SERIAL NOT NULL, "status_name" character varying(255) NOT NULL, "color" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fceb27f474dc30ca6766234087a" UNIQUE ("status_name"), CONSTRAINT "PK_76c6dc5bccb3ef1a4a8510cab3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "order_delivered_carrier_date" TIMESTAMP, "order_delivered_user_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "order_status_id" integer, "shipping_address_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_reviews" ("id" SERIAL NOT NULL, "rating" smallint NOT NULL, "review_text" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_67c1501aea1b0633ec441b00bd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["shop-co","public","order_items","GENERATED_COLUMN","total","price * quantity"]);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "price" numeric NOT NULL, "quantity" integer NOT NULL, "total" numeric GENERATED ALWAYS AS (price * quantity) STORED NOT NULL, "order_id" integer, "product_variant_id" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_parents" ("category_id" integer NOT NULL, "parent_id" integer NOT NULL, CONSTRAINT "PK_17fd9110212734583fbdfd9b262" PRIMARY KEY ("category_id", "parent_id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("id" SERIAL NOT NULL, "iso" character(2) NOT NULL, "name" character varying(80) NOT NULL, "upper_name" character varying(80) NOT NULL, "iso3" character(3), "num_code" smallint, "phone_code" integer NOT NULL, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "allowed_attributes" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "type" character varying(50) NOT NULL, "description" character varying(256), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a08af47ae83b372fc97dde19cc" UNIQUE ("name"), CONSTRAINT "PK_732b413eb4ac0ed3f491daa2186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_attributes" ("id" SERIAL NOT NULL, "category_id" integer, "attribute_id" integer, CONSTRAINT "PK_f58b128e30a1ad029b32fb79624" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cart_id" integer NOT NULL, "product_id" integer, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "allowed_attribute_values" ("id" SERIAL NOT NULL, "value_string" character varying(256), "value_number" numeric, "range_min" numeric, "range_max" numeric, "color_hex" character varying(10), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attribute_id" integer NOT NULL, CONSTRAINT "PK_28fc42a3b63382475ed9fe60175" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_512bf776587ad5fc4f804277d76" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "FK_16f64e06715ce4fea8257cc42c5" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant_gallery" ADD CONSTRAINT "FK_6f6007ae2a91b6454d2f9be966d" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_addresses" ADD CONSTRAINT "FK_7a5100ce0548ef27a6f1533a5ce" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f51b75ebdfdef60d264f982a60f" FOREIGN KEY ("order_status_id") REFERENCES "order_statuses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_67b8be57fc38bda573d2a8513ec" FOREIGN KEY ("shipping_address_id") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_1d3fbb451c2b63d0a763f3ff5b1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_reviews" ADD CONSTRAINT "FK_8306941b81cb5be7d521bdc0834" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_11836543386b9135a47d54cab70" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_parents" ADD CONSTRAINT "FK_8e1862c8157087c03c16c4d1a15" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_parents" ADD CONSTRAINT "FK_6b5b060c1a4285b256461d87aa3" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_55050a8a1b2d2f5202f226d4ac1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_6730826326fa81ff5511cb0981a" FOREIGN KEY ("attribute_id") REFERENCES "allowed_attributes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allowed_attribute_values" ADD CONSTRAINT "FK_cc12aaa68449a240d47dc2ffbb8" FOREIGN KEY ("attribute_id") REFERENCES "allowed_attributes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "allowed_attribute_values" DROP CONSTRAINT "FK_cc12aaa68449a240d47dc2ffbb8"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_6730826326fa81ff5511cb0981a"`);
        await queryRunner.query(`ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_55050a8a1b2d2f5202f226d4ac1"`);
        await queryRunner.query(`ALTER TABLE "category_parents" DROP CONSTRAINT "FK_6b5b060c1a4285b256461d87aa3"`);
        await queryRunner.query(`ALTER TABLE "category_parents" DROP CONSTRAINT "FK_8e1862c8157087c03c16c4d1a15"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_11836543386b9135a47d54cab70"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_8306941b81cb5be7d521bdc0834"`);
        await queryRunner.query(`ALTER TABLE "product_reviews" DROP CONSTRAINT "FK_1d3fbb451c2b63d0a763f3ff5b1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_67b8be57fc38bda573d2a8513ec"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f51b75ebdfdef60d264f982a60f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_9148da8f26fc248e77a387e3112"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6"`);
        await queryRunner.query(`ALTER TABLE "user_addresses" DROP CONSTRAINT "FK_7a5100ce0548ef27a6f1533a5ce"`);
        await queryRunner.query(`ALTER TABLE "product_variant_gallery" DROP CONSTRAINT "FK_6f6007ae2a91b6454d2f9be966d"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_16f64e06715ce4fea8257cc42c5"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "FK_512bf776587ad5fc4f804277d76"`);
        await queryRunner.query(`DROP TABLE "allowed_attribute_values"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "category_attributes"`);
        await queryRunner.query(`DROP TABLE "allowed_attributes"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "category_parents"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","total","shop-co","public","order_items"]);
        await queryRunner.query(`DROP TABLE "product_reviews"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_statuses"`);
        await queryRunner.query(`DROP TABLE "product_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "user_addresses"`);
        await queryRunner.query(`DROP TABLE "product_variant_gallery"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
