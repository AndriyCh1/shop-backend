import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdesAndOrderItemsUpdate1734032032948
  implements MigrationInterface
{
  name = 'OrdesAndOrderItemsUpdate1734032032948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "total" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total"`);
  }
}
